import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import { Builder } from 'builder-pattern';
import { SendVerificationDto, VerifyEmailDto } from '../../dtos/mail.dto';
import { SuccessResponse } from 'src/utils/format';
import { MailService } from 'src/services/mail.service';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('/send-verification')
  @ApiOperation({ summary: 'Send verification code to email or phone' })
  @ApiResponse({
    status: 200,
    description: 'Verification code sent successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async sendVerification(@Body() sendVerificationDto: SendVerificationDto) {
    try {
      const responseMessage = await this.mailService.sendVerification(sendVerificationDto)

      return Builder<SuccessResponse>()
        .data(null)
        .message(responseMessage)
        .status(StatusCodes.OK)
        .build();

    } catch (error) {
      console.error('Send verification error:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/verify-email')
  @ApiOperation({ summary: 'Verify email with OTP code' })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid verification code' })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    try {
      const result = await this.mailService.verifyEmail(verifyEmailDto.email, verifyEmailDto.code);

      return Builder<SuccessResponse>()
        .data(result)
        .message('Email verified successfully')
        .status(StatusCodes.OK)
        .build();

    } catch (error) {
      console.error('Verify email error:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}