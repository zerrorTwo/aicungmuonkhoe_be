import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OtpType } from 'src/entities/otp-record.entity';

export class SendVerificationDto {
  @ApiProperty({
    description: 'User ID',
    example: '123456',
  })
  @IsOptional()
  @IsString()
  USER_ID: string;

  @ApiProperty({
    description: 'Email address to send verification code (optional)',
    example: 'user@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  EMAIL?: string;

  @ApiProperty({
    description: 'Phone number to send verification code (optional)',
    example: '0987654321',
    required: false,
  })
  @IsOptional()
  @IsString()
  PHONE?: string;

  @ApiProperty({
    description: 'Type of OTP (e.g., UPDATE_EMAIL, RESET_PASSWORD)',
    example: 'UPDATE_EMAIL',
  })
  @IsString()
  OTP_TYPE: OtpType;
}

export class VerifyEmailDto {
  @ApiProperty({
    description: 'Email address',
    example: 'user@example.com',
  })
  @IsEmail()
  EMAIL: string;

  @ApiProperty({
    description: '6-digit OTP code',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @MinLength(6)
  CODE: string;
}
