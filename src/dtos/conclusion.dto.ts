import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateConclusionClientDto {
  @IsString()
  MODEL: string;

  @IsString()
  DATE: string;

  @IsString()
  TIME: string;

  @IsNumber()
  HEALTH_DOCUMENT_ID: number;

  @IsOptional()
  @IsNumber()
  VALUE_SYS?: number;

  @IsOptional()
  @IsNumber()
  VALUE_DIA?: number;

  @IsNumber()
  VALUE: number;

  @IsOptional()
  @IsString()
  INDICATOR?: string;

  @IsOptional()
  @IsNumber()
  VALUE_WEIGHT?: number;

  @IsOptional()
  @IsNumber()
  VALUE_HEIGHT?: number;

  @IsOptional()
  @IsString()
  AGE_TYPE?: string;

  @IsOptional()
  @IsString()
  CREATED_BY?: number;
}

export class UpdateConclusionClientDto extends CreateConclusionClientDto {
  @IsOptional()
  @IsNumber()
  ID: number;

  @IsOptional()
  @IsNumber()
  UPDATED_BY?: number;
}

export class ConclusionQueryDto {
  @IsOptional()
  @IsString()
  ID?: string;

  @IsOptional()
  @IsString()
  START_TIME?: string;

  @IsOptional()
  @IsString()
  END_TIME?: string;

  @IsOptional()
  @IsString()
  MODEL?: string;

  @IsOptional()
  @IsString()
  AGE_TYPE?: string;

  @IsOptional()
  @IsString()
  SORT?: string;

  @IsOptional()
  @IsString()
  ACTIVE_TAB?: string;

  @IsOptional()
  @IsString()
  OFFSET?: string;

  @IsOptional()
  @IsString()
  LIMIT?: string;
}

// ============================================
// Admin DTOs for Conclusion Management
// ============================================

export class CreateConclusionManagementDto {
  @IsString()
  MODEL: string;

  @IsOptional()
  @IsString()
  AGE_TYPE?: string;

  @IsOptional()
  @IsString()
  TYPE?: string;

  @IsOptional()
  @IsString()
  GENDER?: string;

  @IsOptional()
  @IsString()
  INDICATOR_FROM?: string;

  @IsOptional()
  @IsString()
  INDICATOR_TO?: string;

  @IsOptional()
  @IsString()
  INDICATOR_AND?: string;

  @IsOptional()
  @IsNumber()
  VALUE_FROM?: number;

  @IsOptional()
  @IsNumber()
  VALUE_TO?: number;

  @IsOptional()
  @IsNumber()
  VALUE_ONE_FROM?: number;

  @IsOptional()
  @IsNumber()
  VALUE_ONE_TO?: number;

  @IsString()
  CONCLUSION: string;

  @IsString()
  RECOMMEND: string;
}

export class UpdateConclusionManagementDto {
  @IsOptional()
  @IsString()
  AGE_TYPE?: string;

  @IsOptional()
  @IsString()
  TYPE?: string;

  @IsOptional()
  @IsString()
  GENDER?: string;

  @IsOptional()
  @IsString()
  INDICATOR_FROM?: string;

  @IsOptional()
  @IsString()
  INDICATOR_TO?: string;

  @IsOptional()
  @IsString()
  INDICATOR_AND?: string;

  @IsOptional()
  @IsNumber()
  VALUE_FROM?: number;

  @IsOptional()
  @IsNumber()
  VALUE_TO?: number;

  @IsOptional()
  @IsNumber()
  VALUE_ONE_FROM?: number;

  @IsOptional()
  @IsNumber()
  VALUE_ONE_TO?: number;

  @IsOptional()
  @IsString()
  CONCLUSION?: string;

  @IsOptional()
  @IsString()
  RECOMMEND?: string;
}

export class BulkCreateConclusionDto {
  @IsString()
  model: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  ageType?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateConclusionManagementDto)
  items: CreateConclusionManagementDto[];
}

export class ConclusionManagementQueryDto {
  @IsString()
  model: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  ageType?: string;
}
