import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsEnum,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum TypeAdvice {
  NENAN = 'NENAN', // Nên ăn
  HANCHEAN = 'HANCHEAN', // Hạn chế ăn
}

export enum FoodGroup {
  THUCPHAMGIAUCHATBOTDUONG = 'THUCPHAMGIAUCHATBOTDUONG',
  THUCPHAMGIAUCHATDAM = 'THUCPHAMGIAUCHATDAM',
  THUCPHAMGIAUCHATBEO = 'THUCPHAMGIAUCHATBEO',
  RAUCUQUA = 'RAUCUQUA',
  TRAICAY = 'TRAICAY',
  HATDAUMOBO = 'HATDAUMOBO',
  SUAVACACSANPHAMTUSUA = 'SUAVACACSANPHAMTUSUA',
  KHAC = 'KHAC',
}

export enum GILevel {
  GITHAP = 'GITHAP', // GI thấp
  GITRUNGBINH = 'GITRUNGBINH', // GI trung bình
  GICAO = 'GICAO', // GI cao
}

/**
 * DTO for querying food recommendations
 * Based on health document ID instead of health status ID
 */
export class GetFoodRecommendationDto {
  @ApiProperty({ description: 'Health document ID', example: 1 })
  @IsNumber()
  @Type(() => Number)
  healthDocumentId: number;

  @ApiProperty({
    description: 'Type of advice',
    enum: TypeAdvice,
    example: TypeAdvice.NENAN,
  })
  @IsEnum(TypeAdvice)
  typeAdvice: TypeAdvice;

  @ApiPropertyOptional({
    description: 'Search keywords (support multiple, separated by comma)',
    example: 'bí đỏ, đậu hà lan',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Food groups to filter',
    type: [String],
    enum: FoodGroup,
    example: [FoodGroup.THUCPHAMGIAUCHATDAM, FoodGroup.RAUCUQUA],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  foodGroups?: string[];

  @ApiPropertyOptional({
    description: 'Fat levels to filter (MUCBEO1, MUCBEO2, ...)',
    type: [String],
    example: ['MUCBEO1', 'MUCBEO2'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fatLevels?: string[];

  @ApiPropertyOptional({
    description: 'GI levels to filter',
    type: [String],
    enum: GILevel,
    example: [GILevel.GITHAP, GILevel.GITRUNGBINH],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  giLevels?: string[];

  @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}

/**
 * Food details with nutritional information
 */
export class FoodDetailsDto {
  @ApiProperty({ description: 'Food ID' })
  ID: number;

  @ApiProperty({ description: 'Food name' })
  NAME: string;

  @ApiProperty({ description: 'Food image URL' })
  IMAGE?: string;

  @ApiProperty({ description: 'Cooked food image URL' })
  IMAGE_COOKED?: string;

  @ApiProperty({ description: 'Energy per 100g (kcal)' })
  ENERGY?: number;

  @ApiProperty({ description: 'Fat per 100g (g)' })
  FAT?: number;

  @ApiProperty({ description: 'Protein per 100g (g)' })
  PROTEIN?: number;

  @ApiProperty({ description: 'Food group code' })
  GROUP_FOOD?: string;

  @ApiProperty({ description: 'Food group name' })
  FOOD_GROUP_NAME?: string;

  @ApiProperty({ description: 'Protein classification (fat level)' })
  PROTEIN_CLASSIFICATION?: string;

  @ApiProperty({ description: 'Sugar classification (GI level)' })
  SUGAR_CLASSIFICATION?: string;

  @ApiProperty({ description: 'Fruit classification (GI level)' })
  FRUIT_CLASSIFICATION?: string;
}

/**
 * Pagination information
 */
export class PaginationDto {
  @ApiProperty({ description: 'Current page' })
  curPage: number;

  @ApiProperty({ description: 'Limit per page' })
  limitPage: number;

  @ApiProperty({ description: 'Total rows' })
  totalRows: number;

  @ApiProperty({ description: 'Total pages' })
  totalPage: number;
}

/**
 * Response DTO for food recommendations with pagination
 */
export class FoodRecommendationResponseDto {
  @ApiProperty({ description: 'Health status ID' })
  healthStatusId: string;

  @ApiProperty({ description: 'List of foods', type: [FoodDetailsDto] })
  listData: FoodDetailsDto[];

  @ApiProperty({ description: 'Pagination info' })
  paging: PaginationDto;
}
