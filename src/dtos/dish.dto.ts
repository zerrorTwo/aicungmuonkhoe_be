import { IsString, IsOptional, IsNumber } from 'class-validator';

// ===== REQUEST DTOs =====
export class GetDishesByAgeDto {
  @IsString()
  ageGroupId: string;
}

export class GetDishDetailDto {
  @IsString()
  id: string;

  @IsString()
  ageGroupId: string;
}

// ===== RESPONSE DTOs =====
export class DishBasicResponseDto {
  ID: string;
  AGE_GROUP_ID: string;
  NAME: string;
  REGION_ID: string;
  COOKING_METHOD_ID: string;
  COOKING_METHOD_NAME?: string;
  MEAL_STRUCTURE_ID: string;
  SMALL_IMAGE: string;
  LARGE_IMAGE: string;
  STATUS: number;
  COOKING_INSTRUCTION: string;
  TIPS: string;
  CREATED_AT: Date;
}

export class NutritionInfoDto {
  ENERGY: number;
  WATER: number;
  PROTEIN: number;
  ANIMAL_PROTEIN: number;
  VEGETABLE_PROTEIN: number;
  FAT: number;
  ANIMAL_FAT: number;
  VEGETABLE_FAT: number;
  STARCH_SUGAR: number;
  FIBER: number;
  MONO_UNSATURATED_FAT: number;
  POLY_UNSATURATED_FAT: number;
  TOTAL_UNSATURATED_FAT: number;
  CHOLESTEROL: number;
  SUGAR: number;
}

export class IngredientDetailDto {
  ID: number;
  NAME: string;
  WEIGHT: number;
  PROCESSING_METHOD: string;
  IMAGE: string;
  IMAGE_COOKED: string;
}

export class DishDetailResponseDto extends DishBasicResponseDto {
  ADDITIONAL_INFO: string;
  TAGS: string[];
  INGREDIENTS: IngredientDetailDto[];
  NUTRITION: NutritionInfoDto;
}
