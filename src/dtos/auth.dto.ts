import {
    IsNotEmpty,
    IsString,
    IsEmail,
    MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
    @ApiProperty({
        description: 'Email of the user',
        example: 'user@example.com',
    })
    @IsNotEmpty()
    @IsEmail()
    EMAIL: string;

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

export class AuthSignupDto {
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
