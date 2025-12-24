import { IsOptional, IsNumber, IsString, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for querying nutritional standards
 * 
 * Used to find appropriate nutritional recommendations based on user profile
 * All fields are optional to allow flexible querying
 */
export class GetNutritionalStandardDto {
  @ApiPropertyOptional({ description: 'Age range ID (e.g., A1, A2)' })
  @IsOptional()
  @IsString()
  ageRangeId?: string;

  @ApiPropertyOptional({ description: 'Health status ID (e.g., HS001)' })
  @IsOptional()
  @IsString()
  healthStatusId?: string;

  @ApiPropertyOptional({ description: 'Gender ID (1=male, 2=female)' })
  @IsOptional()
  @IsInt()
  genderId?: number;

  @ApiPropertyOptional({ description: 'User weight in kg' })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({ description: 'Physical activity/exercise intensity ID' })
  @IsOptional()
  @IsInt()
  physicalActivityId?: number;
}

/**
 * Response DTO for daily nutrition standards
 * 
 * Contains complete nutritional requirements and meal distribution
 */
export class NutritionalStandardResponseDto {
  @ApiProperty({ description: 'Nutritional standard ID' })
  id: number;

  @ApiProperty({ description: 'Total daily energy requirement (kcal)' })
  dailyEnergy: number;

  @ApiProperty({ description: 'Total daily protein requirement (g)' })
  dailyProtein: number;

  @ApiProperty({ description: 'Total daily lipid/fat requirement (g)' })
  dailyLipid: number;

  @ApiProperty({ description: 'Total daily glucid/carbohydrate requirement (g)' })
  dailyGlucid: number;

  @ApiProperty({ description: 'Meal structure type (3 or 4 meals)' })
  mealStructure: number;

  @ApiProperty({ description: 'Energy distribution per meal' })
  mealDistribution: MealEnergyDistributionDto[];

  @ApiProperty({ description: 'Macronutrient distribution per meal' })
  macronutrientDistribution: MacronutrientDistributionDto[];

  @ApiProperty({ description: 'Ingredient recommendations (fruits, vegetables, salt)' })
  ingredientRecommendations: IngredientRecommendationDto;
}

/**
 * Energy distribution for a specific meal
 */
export class MealEnergyDistributionDto {
  @ApiProperty({ description: 'Meal type code (BS, BTR, BP, BT)' })
  mealTypeCode: string;

  @ApiProperty({ description: 'Meal type name' })
  mealTypeName: string;

  @ApiProperty({ description: 'Minimum energy for this meal (kcal)' })
  energyMin: number;

  @ApiProperty({ description: 'Maximum energy for this meal (kcal)' })
  energyMax: number;

  @ApiProperty({ description: 'Percentage of daily energy' })
  energyPercentage: number;
}

/**
 * Macronutrient distribution for a specific meal
 */
export class MacronutrientDistributionDto {
  @ApiProperty({ description: 'Meal type code (BS, BTR, BP, BT)' })
  mealTypeCode: string;

  @ApiProperty({ description: 'Meal type name' })
  mealTypeName: string;

  @ApiProperty({ description: 'Protein min-max (g)' })
  protein: { min: number; max: number; percentage: string };

  @ApiProperty({ description: 'Lipid/Fat min-max (g)' })
  lipid: { min: number; max: number; percentage: string };

  @ApiProperty({ description: 'Glucid/Carbohydrate min-max (g)' })
  glucid: { min: number; max: number; percentage: string };
}

/**
 * Ingredient recommendations (fruits, vegetables, salt)
 */
export class IngredientRecommendationDto {
  @ApiProperty({ description: 'Daily fruit recommendation (servings)' })
  dailyFruit: number;

  @ApiProperty({ description: 'Daily vegetable recommendation (servings)' })
  dailyVegetable: number;

  @ApiProperty({ description: 'Daily salt limit (grams)' })
  dailySalt: number;

  @ApiProperty({ description: 'Per-meal fruit distribution' })
  fruitPerMeal: { [mealCode: string]: number };

  @ApiProperty({ description: 'Per-meal vegetable distribution' })
  vegetablePerMeal: { [mealCode: string]: number };

  @ApiProperty({ description: 'Per-meal salt limit' })
  saltPerMeal: { [mealCode: string]: number };
}

/**
 * DTO for getting nutrition summary by health document ID
 */
export class GetNutritionByHealthDocumentDto {
  @ApiProperty({ description: 'Health document ID' })
  @IsInt()
  healthDocumentId: number;

  @ApiPropertyOptional({ description: 'Meal structure preference (3 or 4 meals)', default: 3 })
  @IsOptional()
  @IsInt()
  mealStructure?: number;
}
