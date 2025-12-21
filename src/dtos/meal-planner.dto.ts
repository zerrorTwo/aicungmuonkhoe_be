import {
  IsInt,
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * DTO for dish within a meal
 */
export class MealDishDto {
  @ApiProperty({ description: 'Dish ID' })
  @IsString()
  dishId: string;

  @ApiProperty({ description: 'Dish salt formula ID' })
  @IsString()
  dishSaltFormulaId: string;
}

/**
 * DTO for creating a meal within a meal planner
 */
export class CreateMealPlannerMealDto {
  @ApiProperty({ description: 'Meal type code (BS, BTR, BP, BT)' })
  @IsString()
  mealTypeCode: string;

  @ApiPropertyOptional({
    description: 'Meal order (for multiple meals of same type)',
    default: 1,
  })
  @IsOptional()
  @IsInt()
  mealOrder?: number;

  @ApiProperty({ description: 'Dishes for this meal', type: [MealDishDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealDishDto)
  dishes: MealDishDto[];
}

/**
 * DTO for creating a new meal planner
 */
export class CreateMealPlannerDto {
  @ApiProperty({ description: 'Health document ID for this meal plan' })
  @IsInt()
  healthDocumentId: number;

  @ApiProperty({ description: 'Date for this meal plan (YYYY-MM-DD)' })
  @IsDateString()
  planDate: string;

  @ApiProperty({
    description: 'Meals to include in the plan',
    type: [CreateMealPlannerMealDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMealPlannerMealDto)
  meals: CreateMealPlannerMealDto[];
}

/**
 * DTO for updating a meal within a meal planner
 */
export class UpdateMealPlannerMealDto {
  @ApiPropertyOptional({
    description: 'Meal planner meal ID (if updating existing)',
  })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty({ description: 'Meal type code (BS, BTR, BP, BT)' })
  @IsString()
  mealTypeCode: string;

  @ApiPropertyOptional({ description: 'Meal order', default: 1 })
  @IsOptional()
  @IsInt()
  mealOrder?: number;

  @ApiPropertyOptional({ description: 'Whether this meal has been eaten' })
  @IsOptional()
  @IsBoolean()
  eaten?: boolean;

  @ApiPropertyOptional({
    description: 'Dishes for this meal',
    type: [MealDishDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealDishDto)
  dishes?: MealDishDto[];
}

/**
 * DTO for updating a meal planner
 */
export class UpdateMealPlannerDto {
  @ApiPropertyOptional({
    description: 'Updated meals',
    type: [UpdateMealPlannerMealDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateMealPlannerMealDto)
  meals?: UpdateMealPlannerMealDto[];
}

/**
 * DTO for marking a meal as eaten
 */
export class MarkMealEatenDto {
  @ApiProperty({ description: 'Meal planner meal ID' })
  @IsInt()
  mealId: number;

  @ApiProperty({ description: 'Eaten status' })
  @IsBoolean()
  eaten: boolean;
}

/**
 * Response DTO for meal planner
 */
export class MealPlannerResponseDto {
  @ApiProperty({ description: 'Meal planner ID' })
  id: number;

  @ApiProperty({ description: 'Health document ID' })
  healthDocumentId: number;

  @ApiProperty({ description: 'Plan date (YYYY-MM-DD)' })
  planDate: string;

  @ApiProperty({ description: 'Meals in this plan' })
  meals: MealPlannerMealResponseDto[];

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiProperty({ description: 'Total energy for the day (kcal)' })
  totalEnergy?: number;

  @ApiProperty({ description: 'Total protein for the day (g)' })
  totalProtein?: number;

  @ApiProperty({ description: 'Total fat for the day (g)' })
  totalFat?: number;

  @ApiProperty({ description: 'Total carbs for the day (g)' })
  totalCarbs?: number;
}

/**
 * Response DTO for meal within a meal planner
 */
export class MealPlannerMealResponseDto {
  @ApiProperty({ description: 'Meal ID' })
  id: number;

  @ApiProperty({ description: 'Meal type code' })
  mealTypeCode: string;

  @ApiProperty({ description: 'Meal type name' })
  mealTypeName: string;

  @ApiProperty({ description: 'Meal order' })
  mealOrder: number;

  @ApiProperty({ description: 'Whether this meal has been eaten' })
  eaten: boolean;

  @ApiProperty({ description: 'Dishes in this meal' })
  dishes: MealDishResponseDto[];

  @ApiProperty({ description: 'Total energy for this meal (kcal)' })
  totalEnergy?: number;

  @ApiProperty({ description: 'Total protein for this meal (g)' })
  totalProtein?: number;
}

/**
 * Response DTO for dish within a meal
 */
export class MealDishResponseDto {
  @ApiProperty({ description: 'Meal dish ID' })
  id: number;

  @ApiProperty({ description: 'Dish ID' })
  dishId: string;

  @ApiProperty({ description: 'Dish name' })
  dishName: string;

  @ApiProperty({ description: 'Dish salt formula ID' })
  dishSaltFormulaId: string;

  @ApiProperty({ description: 'Dish image' })
  dishImage?: string;

  @ApiProperty({ description: 'Cooking instructions' })
  cookingInstructions?: string;

  @ApiProperty({ description: 'Nutritional information' })
  nutrition?: {
    energy: number;
    protein: number;
    fat: number;
    carbs: number;
  };
}

/**
 * DTO for querying meal planners
 */
export class GetMealPlannerDto {
  @ApiProperty({ description: 'Health document ID' })
  @IsInt()
  healthDocumentId: number;

  @ApiPropertyOptional({ description: 'Start date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

/**
 * DTO for suggesting meal plans based on nutritional needs
 */
export class SuggestMealPlanDto {
  @ApiProperty({ description: 'Health document ID' })
  @IsInt()
  healthDocumentId: number;

  @ApiProperty({ description: 'Date for the suggested plan (YYYY-MM-DD)' })
  @IsDateString()
  planDate: string;

  @ApiPropertyOptional({
    description: 'Meal structure (3 or 4 meals)',
    default: 3,
  })
  @IsOptional()
  @IsInt()
  mealStructure?: number;

  @ApiPropertyOptional({
    description: 'Specific meal types to suggest for',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mealTypes?: string[];
}

/**
 * Response DTO for suggested dishes
 */
export class SuggestedDishesResponseDto {
  @ApiProperty({ description: 'Meal type code' })
  mealTypeCode: string;

  @ApiProperty({ description: 'Meal type name' })
  mealTypeName: string;

  @ApiProperty({ description: 'Suggested dishes for this meal' })
  dishes: SuggestedDishDto[];
}

/**
 * Single suggested dish with details
 */
export class SuggestedDishDto {
  @ApiProperty({ description: 'Dish ID' })
  dishId: string;

  @ApiProperty({ description: 'Dish name' })
  dishName: string;

  @ApiProperty({ description: 'Dish image' })
  dishImage?: string;

  @ApiProperty({ description: 'Available salt formulas' })
  saltFormulas: string[];

  @ApiProperty({ description: 'Estimated energy (kcal)' })
  estimatedEnergy: number;

  @ApiProperty({ description: 'Suitability score (0-100)' })
  suitabilityScore: number;

  @ApiProperty({ description: 'Reason for suggestion' })
  reason?: string;
}
