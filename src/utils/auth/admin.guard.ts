import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class AdminGuard extends AuthGuard implements CanActivate {
  constructor(
    reflector: Reflector,
    private readonly userRepository: UserRepository,
  ) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticated = await super.canActivate(context);

    if (!isAuthenticated) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const tokenUser = request.user;

    if (!tokenUser || !tokenUser.user_id) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = await this.userRepository.findById(tokenUser.user_id);

    if (user && user.IS_ADMIN === 1) {
      request.user = user;
      return true;
    }

    throw new ForbiddenException('User is not an admin!');
  }
}
