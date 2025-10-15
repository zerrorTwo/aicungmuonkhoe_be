import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewUserDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  EMAIL: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '0123456789',
  })
  @IsNotEmpty()
  @IsString()
  PHONE: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'StrongPassword123!',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  PASSWORD: string;
}

export class UpdateUserProfileDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'Nguyễn Văn A',
    required: false,
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '0123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Date of birth (YYYY-MM-DD format)',
    example: '1990-01-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  birthDate?: string;

  @ApiProperty({
    description: 'Address/ProvinceID of the user',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  addressId?: number;

  @ApiProperty({
    description:
      'Avatar URL of the user (for JSON requests) or avatar file (for multipart requests)',
    example: 'https://cloudinary.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: 'Gender ID (1: Nam, 2: Nữ, etc.)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  genderId?: number;
}

export class UpdateSecuritySetting {
  @ApiProperty({
    description: 'New Password of the user',
    example: 'StrongPassword123!',
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  NEW_PASSWORD: string;

  @ApiProperty({
    description: 'Current Password of the user',
    example: 'StrongPassword123!',
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  CURRENT_PASSWORD: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '0123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  PHONE?: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsEmail()
  EMAIL?: string;

  @ApiProperty({
    description: 'OTP code sent to the new email for verification',
    example: '123456',
  })
  @IsOptional()
  @IsString()
  OTP_CODE?: string;
}

export class forgotPasswordDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  EMAIL: string;

}

export class resetPasswordDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  EMAIL: string;

  @ApiProperty({
    description: 'OTP code sent to the email for verification',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  OTP_CODE: string;

  @ApiProperty({
    description: 'New password for the user',
    example: 'NewStrongPassword123!',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  NEW_PASSWORD: string;
}