import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  IsInt,
  Min,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
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
    description: 'First name of the user',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  FIRST_NAME?: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  LAST_NAME?: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'StrongPassword123!',
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  PASSWORD?: string;
}

export class UpdateUserProfileDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'Nguyễn Văn A',
    required: false,
  })
  @IsOptional()
  @IsString()
  FULL_NAME?: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '0123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  PHONE?: string;

  @ApiProperty({
    description: 'Date of birth (YYYY-MM-DD format)',
    example: '1990-01-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  DOB?: string;

  @ApiProperty({
    description: 'ProvinceID of the user',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  PROVINCE_ID?: number;

  @ApiProperty({
    description: 'Gender ID (1: Nam, 2: Nữ, etc.)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  GENDER_ID?: number;
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

// ============================================
// Admin DTOs for User Management
// ============================================

export class AdminUserQueryDto {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiProperty({
    description: 'Search by email, phone, or name',
    example: 'john@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter by status (0: inactive, 1: active)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  status?: number;

  @ApiProperty({
    description: 'Filter by admin role (0: user, 1: admin)',
    example: 0,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  isAdmin?: number;
}

export class AdminUpdateUserDto {
  @ApiProperty({
    description: 'User status (0: inactive, 1: active)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  STATUS_ACTIVE?: number;

  @ApiProperty({
    description: 'Admin role (0: user, 1: admin)',
    example: 0,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  IS_ADMIN?: number;

  @ApiProperty({
    description: 'Email of the user',
    example: 'user@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  EMAIL?: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '0123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  PHONE?: string;
}
