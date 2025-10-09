import { IsEmail, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendVerificationDto {
  @ApiProperty({
    description: 'Email address to send verification code (optional)',
    example: 'user@example.com',
    required: false
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Phone number to send verification code (optional)',
    example: '0987654321',
    required: false
  })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class VerifyEmailDto {
  @ApiProperty({
    description: 'Email address',
    example: 'user@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '6-digit OTP code',
    example: '123456',
    minLength: 6,
    maxLength: 6
  })
  @IsString()
  @MinLength(6)
  code: string;
}