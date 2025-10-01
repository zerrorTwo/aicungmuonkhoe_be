import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { StatusCodes } from 'http-status-codes';
import type { Response } from 'express';
import { AuthLoginDto, AuthSignupDto } from 'src/dtos/auth.dto';
import { AuthService } from 'src/services/auth.service';
import { SuccessMessages } from 'src/utils/constants/message.constants';
import { SuccessResponse } from 'src/utils/format';
import { User } from '../../entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Login auth with email and password' })
    @ApiResponse({ status: 200, description: 'Successfully logged in' })
    @ApiResponse({
        status: 401,
        description: 'Invalid email or password',
    })
    async login(@Body() loginDto: AuthLoginDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.login(loginDto, res);

        return Builder<SuccessResponse<{ user: User, access_token: string }>>()
            .data(result)
            .message(SuccessMessages.SIGN_IN_SUCCESSFULLY)
            .status(StatusCodes.OK)
            .build();
    }

    @Post('signup')
    @ApiOperation({ summary: 'Signup auth with email, first name, last name and password' })
    @ApiResponse({ status: 200, description: 'Successfully signed up' })
    @ApiResponse({
        status: 401,
        description: 'Invalid email or password',
    })
    async signup(@Body() signupDto: AuthSignupDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.signup(signupDto, res);

        return Builder<SuccessResponse<{ user: User, access_token: string }>>()
            .data(result)
            .message(SuccessMessages.SIGN_UP_SUCCESSFULLY)
            .status(StatusCodes.OK)
            .build();
    }

    @Get('/refresh-token')
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'Successfully refreshed access token' })
    async refreshToken(@Req() req, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.refreshToken(req, res);

        return Builder<SuccessResponse<{ user: User, access_token: string }>>()
            .data(result)
            .message(SuccessMessages.ACCESS_TOKEN_SUCCESSFULLY)
            .status(StatusCodes.OK)
            .build();
    }

    @Post('/logout')
    @ApiOperation({ summary: 'Logout user' })
    @ApiResponse({ status: 200, description: 'Successfully logged out' })
    async logout(@Res({ passthrough: true }) res: Response) {
        // Clear the refresh token cookie
        res.clearCookie('refresh_token', {
            httpOnly: true,
            path: '/',
        });

        return Builder<SuccessResponse<null>>()
            .data(null)
            .message(SuccessMessages.LOGGED)
            .status(StatusCodes.OK)
            .build();
    }

}
