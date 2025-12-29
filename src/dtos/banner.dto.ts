import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateBannerDto {
  @ApiProperty({
    description: 'Title of the banner',
    example: 'New Promotion',
  })
  @IsNotEmpty()
  @IsString()
  TITLE: string;

  @ApiProperty({
    description: 'Image URL of the banner',
    example: 'https://example.com/banner.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  IMAGE?: string;

  @ApiProperty({
    description: 'Active status of the banner',
    example: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  ACTIVE?: boolean;
}

export class UpdateBannerDto {
  @ApiProperty({
    description: 'Title of the banner',
    example: 'New Promotion',
    required: false,
  })
  @IsOptional()
  @IsString()
  TITLE?: string;

  @ApiProperty({
    description: 'Image URL of the banner',
    example: 'https://example.com/banner.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  IMAGE?: string;

  @ApiProperty({
    description: 'Active status of the banner',
    example: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  ACTIVE?: boolean;
}

export class BannerQueryDto {
  @ApiProperty({
    description: 'Page number',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiProperty({
    description: 'Items per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiProperty({
    description: 'Search term',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter by active status',
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  active?: boolean;
}
