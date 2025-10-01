import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import Jwt from 'jsonwebtoken';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const refreshToken = req.cookies?.refresh_token;

        if (!refreshToken) {
            throw new UnauthorizedException('No refresh token provided');
        }

        try {
            const payload = Jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            req['refreshTokenPayload'] = payload;
            next();
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}