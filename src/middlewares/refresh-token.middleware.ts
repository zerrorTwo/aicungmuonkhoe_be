import { GoneException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import Jwt from 'jsonwebtoken';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new GoneException('No refresh token provided');
    }

    try {
      const payload = Jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
      req['refreshTokenPayload'] = payload;
      next();
    } catch (error) {
      throw new GoneException('Invalid refresh token');
    }
  }
}
