import { Injectable, Logger, NotFoundException, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';
import { AuthLoginDto, AuthSignupDto } from 'src/dtos/auth.dto';
import { User } from 'src/entities/user.entity';
import { UserRepository } from 'src/repositories/user.repository';
import { checkPassword, generateAccessToken, generateRefreshToken, HashPassword } from 'src/utils/auth/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly _userRepository: UserRepository) { }

  async login(authLogin: AuthLoginDto, res: Response) {

    const user = await this._userRepository.findByEmail(authLogin.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await checkPassword(authLogin.password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const access_token = generateAccessToken({ user_id: user.user_id, email: user.email, full_name: `${user.first_name} ${user.last_name}` });
    const refresh_token = generateRefreshToken({ user_id: user.user_id, email: user.email, full_name: `${user.first_name} ${user.last_name}` });

    res.cookie('refresh_token', refresh_token, { httpOnly: true, path: '/', maxAge: 7 * 24 * 60 * 60 * 1000 });

    return { user, access_token };
  }

  async signup(authSignup: AuthSignupDto, res: Response): Promise<{ user: User, access_token: string }> {
    const user = await this._userRepository.findByEmail(authSignup.email);

    if (user) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await HashPassword(authSignup.password);

    const newUser = {
      email: authSignup.email,
      password: hashedPassword,
      first_name: authSignup.first_name,
      last_name: authSignup.last_name,
    };

    const createdUser = await this._userRepository.create(newUser);

    if (!createdUser) {
      throw new InternalServerErrorException('Failed to create user');
    }

    const access_token = generateAccessToken({ user_id: createdUser.user_id, email: createdUser.email, dob: createdUser.dob, phone: createdUser.phone, full_name: `${createdUser.first_name} ${createdUser.last_name}` });
    const refresh_token = generateRefreshToken({ user_id: createdUser.user_id, email: createdUser.email, dob: createdUser.dob, phone: createdUser.phone, full_name: `${createdUser.first_name} ${createdUser.last_name}` });

    res.cookie('refresh_token', refresh_token, { httpOnly: true, path: '/', maxAge: 7 * 24 * 60 * 60 * 1000 });

    return { user: createdUser, access_token };
  }

}
