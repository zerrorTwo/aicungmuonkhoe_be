import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { StatusCodes } from 'http-status-codes';
import { MailService } from 'src/services/mail.service';
import { AuthGuard } from 'src/utils/auth/auth.guard';
import { SuccessResponse } from 'src/utils/format';
import { SendVerificationDto, VerifyEmailDto } from '../../dtos/mail.dto';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('/send-verification')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Send verification code to email or phone' })
  @ApiResponse({
    status: 200,
    description: 'Verification code sent successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async sendVerification(
    @Req() req,
    @Body() sendVerificationDto: SendVerificationDto,
  ) {
    const userId = req.user.user_id;
    const responseMessage = await this.mailService.sendVerification(
      sendVerificationDto,
      userId,
    );

    return Builder<SuccessResponse>()
      .data(null)
      .message(responseMessage)
      .status(StatusCodes.OK)
      .build();
  }

  @Post('/verify-email')
  @ApiOperation({ summary: 'Verify email with OTP code' })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid verification code' })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    const result = await this.mailService.verifyEmail(
      verifyEmailDto.EMAIL,
      verifyEmailDto.CODE,
    );

    return Builder<SuccessResponse>()
      .data(result)
      .message('Email verified successfully')
      .status(StatusCodes.OK)
      .build();
  }
}
