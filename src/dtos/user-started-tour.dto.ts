import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Feature } from 'src/enums/user-start-tour.enum';

export class CreateUserStartedTourDto {
  @ApiProperty({
    description: 'Feature name that user has started tour',
    example: 'health_tracking',
  })
  @IsNotEmpty()
  @IsEnum(Feature)
  FEATURE: Feature;
}

export class GetUserStartedTourDto {
  @ApiProperty({
    description: 'Feature name to check if user has started tour',
    example: 'health_tracking',
  })
  @IsNotEmpty()
  @IsEnum(Feature)
  FEATURE: Feature;
}
