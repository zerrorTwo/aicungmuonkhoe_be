import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

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
  @IsOptional()
  VALUE?: number;

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
  CREATED_BY?: string;
}

export class UpdateConclusionClientDto extends CreateConclusionClientDto {
  @IsNumber()
  ID: number;
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
