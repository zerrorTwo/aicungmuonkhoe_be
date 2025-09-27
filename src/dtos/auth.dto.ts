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
    email: string;

    @ApiProperty({
        description: 'Password of the user',
        example: 'StrongPassword123!',
        minLength: 6,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

}

export class AuthSignupDto {
    @ApiProperty({
        description: 'Email of the user',
        example: 'user@example.com',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Password of the user',
        example: 'StrongPassword123!',
        minLength: 6,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({
        description: 'First name of the user',
        example: 'John',
    })
    @IsNotEmpty()
    @IsString()
    first_name: string;

    @ApiProperty({
        description: 'Last name of the user',
        example: 'Doe',
    })
    @IsNotEmpty()
    @IsString()
    last_name: string;

}
