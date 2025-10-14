const jwt = require('jsonwebtoken');
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { IS_PUBLIC_KEY } from './public.decorator';
import { Reflector } from '@nestjs/core';
import loadEnv from '../configs/configuration';
const env = loadEnv();
@Injectable({ scope: Scope.REQUEST })
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    let request = context.switchToHttp().getRequest();
    let token = null;
    if (request.header('Authorization')?.includes('Bearer')) {
      token = request.header('Authorization').replace('Bearer ', '');
    } else {
      token = request.header('Authorization');
    }
    if (!token) {
      throw new UnauthorizedException('Token is invalid!');
    }
    try {
      const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
      if (decoded.user_id) {
        request['user'] = decoded;
        return true;
      }
      throw new UnauthorizedException('Token is invalid!');
    } catch (error) {
      throw new UnauthorizedException('Token is invalid!');
    }
  }
}
