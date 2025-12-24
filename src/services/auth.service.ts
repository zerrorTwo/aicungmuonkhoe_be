import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthLoginDto, AuthSignupDto } from 'src/dtos/auth.dto';
import { CreateNewUserDto } from 'src/dtos/user.dto';
import { User } from 'src/entities/user.entity';
import { HealthDocumentRepository } from 'src/repositories/health-document.repository';
import { UserRepository } from 'src/repositories/user.repository';
import {
  checkPassword,
  generateAccessToken,
  generateRefreshToken,
  HashPassword,
  pickUser,
} from 'src/utils/auth/common';
import Jwt from 'jsonwebtoken';
import { MailService } from './mail.service';
import { OtpType } from 'src/entities/otp-record.entity';
import { UserActiveLogService } from './user-active-log.service';
import { ChatConversationRepository } from 'src/repositories/chat-conversation.repository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly _userRepository: UserRepository,
    private readonly mailService: MailService,
    private readonly userActiveLogService: UserActiveLogService,
    private readonly chatConversationRepository: ChatConversationRepository,
  ) {}

  async login(authLogin: AuthLoginDto, res: Response) {
    const user = await this._userRepository.findByEmail(authLogin.EMAIL);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await checkPassword(authLogin.PASSWORD, user.PASSWORD);

    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.STATUS_ACTIVE) {
      throw new ForbiddenException('User account is inactive');
    }

    const access_token = generateAccessToken({
      user_id: user.USER_ID,
      email: user.EMAIL,
    });
    const refresh_token = generateRefreshToken({
      user_id: user.USER_ID,
      email: user.EMAIL,
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    this.logger.log(`User logged in: ${user.EMAIL}`);

    // Log login activity
    const device = authLogin.DEVICE || 'Unknown';
    await this.userActiveLogService.logLogin(user.USER_ID, device);

    // Check if user has an active, non-expired conversation
    const existingConversation =
      await this.chatConversationRepository.findActiveByUserId(user.USER_ID);
    let conversationId: string;

    if (existingConversation) {
      // Reuse existing conversation if still valid
      conversationId = existingConversation.CONVERSATION_ID;
      this.logger.log(`Reusing existing conversation: ${conversationId}`);
    } else {
      // Create new conversation if no active one exists
      conversationId = `conv_${user.USER_ID}_${uuidv4()}`;
      await this.chatConversationRepository.create(
        user.USER_ID,
        conversationId,
      );
      this.logger.log(`Created new conversation: ${conversationId}`);
    }

    return {
      user: pickUser(user),
      access_token,
      conversation_id: conversationId,
    };
  }

  async signup(
    authSignup: AuthSignupDto,
    res: Response,
  ): Promise<{ user: User; access_token: string }> {
    const user = await this._userRepository.findByEmail(authSignup.EMAIL);

    if (user) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await HashPassword(authSignup.PASSWORD);

    const newUser: CreateNewUserDto = {
      EMAIL: authSignup.EMAIL,
      PHONE: authSignup.PHONE,
      PASSWORD: hashedPassword,
    };

    const createdUser = await this._userRepository.create(newUser);

    if (!createdUser) {
      throw new InternalServerErrorException('Failed to create user');
    }
    // gửi otp xác thực email
    await this.mailService.sendVerificationEmail(
      createdUser.USER_ID.toString(),
      OtpType.SIGN_UP,
    );

    const access_token = generateAccessToken({
      user_id: createdUser.USER_ID,
      email: createdUser.EMAIL,
    });
    const refresh_token = generateRefreshToken({
      user_id: createdUser.USER_ID,
      email: createdUser.EMAIL,
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { user: pickUser(createdUser), access_token };
  }

  async verifyEmailRegistration(email: string, code: string): Promise<void> {
    const user = await this._userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    // kiểm tra otp và cập nhật bảng otp record
    const otpResult = await this.mailService.verifyEmail(user.EMAIL, code);
    if (!otpResult.success) {
      throw new BadRequestException('Invalid OTP');
    }

    // Cập nhật trạng thái người dùng
    user.STATUS_ACTIVE = 1;
    user.UPDATED_AT = new Date();
    await this._userRepository.update(user.USER_ID, user);
  }

  async refreshToken(
    req: any,
    res: Response,
  ): Promise<{ user: User; access_token: string }> {
    const refresh_token = req.cookies.refresh_token;
    if (!refresh_token) {
      throw new UnauthorizedException('No refresh token provided');
    }

    let payload: any;
    try {
      payload = Jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      // Clear invalid refresh token cookie
      res.clearCookie('refresh_token', {
        httpOnly: true,
        path: '/',
      });
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this._userRepository.findById(payload.user_id);
    if (!user) {
      // Clear refresh token cookie if user not found
      res.clearCookie('refresh_token', {
        httpOnly: true,
        path: '/',
      });
      throw new NotFoundException('User not found');
    }

    // Generate new tokens
    const access_token = generateAccessToken({
      user_id: user.USER_ID,
      email: user.EMAIL,
    });

    const new_refresh_token = generateRefreshToken({
      user_id: user.USER_ID,
      email: user.EMAIL,
    });

    // Set new refresh token cookie
    res.cookie('refresh_token', new_refresh_token, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production', // Only use secure in production
      sameSite: 'lax', // CSRF protection
    });

    this.logger.log(`Token refreshed for user: ${user.EMAIL}`);

    return { user, access_token };
  }
}
