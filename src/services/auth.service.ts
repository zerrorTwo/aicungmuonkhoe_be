import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
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
} from 'src/utils/auth/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly _userRepository: UserRepository,
  ) { }

  async login(authLogin: AuthLoginDto, res: Response) {
    const user = await this._userRepository.findByEmail(authLogin.EMAIL);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await checkPassword(authLogin.PASSWORD, user.PASSWORD);

    if (!isValid) {
      throw new UnauthorizedException('Invalid password');
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
    });

    return { user, access_token };
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
      PASSWORD: hashedPassword,
    };

    const createdUser = await this._userRepository.create(newUser);

    if (!createdUser) {
      throw new InternalServerErrorException('Failed to create user');
    }

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
    });

    return { user: createdUser, access_token };
  }
}
