import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtPayload {
  user_id: number;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

/**
 * Custom decorator to extract current user from request
 * Usage: @CurrentUser() user: JwtPayload
 * Or to get specific property: @CurrentUser('user_id') userId: number
 */
export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    // If a specific property is requested, return that property
    if (data) {
      return user?.[data];
    }

    // Otherwise return the entire user object
    return user;
  },
);
