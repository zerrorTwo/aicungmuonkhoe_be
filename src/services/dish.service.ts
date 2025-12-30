import { Injectable, NotFoundException } from '@nestjs/common';
import { DishRepository } from 'src/repositories/dish.repository';
import { DishIngredientRepository } from 'src/repositories/dish-ingredient.repository';
import { AgeRangeRepository } from 'src/repositories/age-range.repository';
import { ConclusionRecommendClientRepository } from 'src/repositories/conclusion-recommend-client.repository';
import {
  DishBasicResponseDto,
  DishDetailResponseDto,
  NutritionInfoDto,
  IngredientDetailDto,
} from 'src/dtos/dish.dto';

@Injectable()
export class DishService {
  constructor(
    private readonly dishRepository: DishRepository,
    private readonly dishIngredientRepository: DishIngredientRepository,
    private readonly ageRangeRepository: AgeRangeRepository,
    private readonly conclusionRecommendClientRepository: ConclusionRecommendClientRepository,
  ) {}

  /**
   * Get dishes by age in years
   */
  async getDishesByAge(ageInYears: number): Promise<DishBasicResponseDto[]> {
    const ageInMonths = ageInYears * 12;
    const ageGroupIds =
      await this.ageRangeRepository.getAgeGroupIdByAge(ageInMonths);

    if (!ageGroupIds || ageGroupIds.length === 0) {
      throw new NotFoundException('Age group not found for the given age');
    }

    const dishes = await this.dishRepository.findByAgeGroupIds(ageGroupIds);

    return dishes.map((dish) => {
      if (dish.ID === 'DIEPCA') {
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
      }
      return {
        ID: dish.ID,
        AGE_GROUP_ID: dish.AGE_GROUP_ID,
        NAME: dish.NAME,
        REGION_ID: dish.REGION_ID,
        COOKING_METHOD_ID: dish.COOKING_METHOD_ID,
        COOKING_METHOD_NAME: dish.COOKING_METHOD?.NAME,
        MEAL_STRUCTURE_ID: dish.MEAL_STRUCTURE_ID,
        SMALL_IMAGE:
          dish.SMALL_IMAGE ||
          'https://via.placeholder.com/300x200?text=No+Image',
        LARGE_IMAGE:
          dish.LARGE_IMAGE ||
          'https://via.placeholder.com/600x400?text=No+Image',
        STATUS: dish.STATUS,
        COOKING_INSTRUCTION: dish.COOKING_INSTRUCTION,
        TIPS: dish.TIPS,
        CREATED_AT: dish.CREATED_AT,
      };
    });
  }

  /**
   * Get recommended dishes based on health status
   */
  async getRecommendedDishesByHealth(
    ageInYears: number,
    healthDocumentId: number,
  ): Promise<{ dishes: DishBasicResponseDto[]; hasHealthData: boolean }> {
    // Get all dishes for age
    const allDishes = await this.getDishesByAge(ageInYears);

    // Get health data from conclusion_recommend_client
    const healthRecords =
      await this.conclusionRecommendClientRepository.findByHealthDocumentId(
        healthDocumentId,
        20,
      );

    if (!healthRecords || healthRecords.length === 0) {
      return { dishes: allDishes, hasHealthData: false };
    }

    // Extract health indicators
    const bmiRecord = healthRecords.find((r) => r.INDICATOR === 'BMI');
    const bloodSugarRecords = healthRecords.filter(
      (r) =>
        r.INDICATOR === 'HUNGRY' ||
        r.INDICATOR === '2_HOURS' ||
        r.INDICATOR === 'HBA1C',
    );
    const cholesterolRecords = healthRecords.filter(
      (r) =>
        r.INDICATOR === 'CHOL' ||
        r.INDICATOR === 'LDL' ||
        r.INDICATOR === 'HDL' ||
        r.INDICATOR === 'TRI',
    );

    // Get dish details with nutrition for filtering
    const dishesWithNutrition = await Promise.all(
      allDishes.map(async (dish) => {
        const detail = await this.getDishDetail(dish.ID, dish.AGE_GROUP_ID);
        return { ...dish, nutrition: detail.NUTRITION };
      }),
    );

    // Filter dishes based on health conditions
    let recommendedDishes = dishesWithNutrition.filter((dish) => {
      let isRecommended = true;

      // BMI-based filtering
      if (bmiRecord && bmiRecord.VALUE) {
        if (bmiRecord.VALUE >= 25) {
          // Overweight - recommend low calorie (< 300 kcal per serving)
          if (dish.nutrition.ENERGY > 300) isRecommended = false;
        } else if (bmiRecord.VALUE < 18.5) {
          // Underweight - recommend high calorie (> 300 kcal per serving)
          if (dish.nutrition.ENERGY < 300) isRecommended = false;
        }
      }

      // Blood sugar-based filtering
      if (bloodSugarRecords.length > 0) {
        const avgBloodSugar =
          bloodSugarRecords.reduce((sum, r) => sum + (r.VALUE || 0), 0) /
          bloodSugarRecords.length;
        if (avgBloodSugar > 7) {
          // High blood sugar - recommend low carbs/sugar (< 40g per serving)
          if (dish.nutrition.STARCH_SUGAR > 40) isRecommended = false;
        }
      }

      // Cholesterol-based filtering
      if (cholesterolRecords.length > 0) {
        const cholRecord = cholesterolRecords.find(
          (r) => r.INDICATOR === 'CHOL',
        );
        if (cholRecord && cholRecord.VALUE && cholRecord.VALUE > 5.2) {
          // High cholesterol - recommend low fat (< 10g per serving)
          if (dish.nutrition.FAT > 10) isRecommended = false;
        }
      }

      return isRecommended;
    });

    // Remove nutrition from response
    const finalDishes = recommendedDishes.map(({ nutrition, ...dish }) => dish);

    return { dishes: finalDishes, hasHealthData: true };
  }

  /**
   * Get dish detail with nutrition calculation
   */
  async getDishDetail(
    id: string,
    ageGroupId: string,
  ): Promise<DishDetailResponseDto> {
    const dish = await this.dishRepository.findByIdWithDetails(id, ageGroupId);

    if (!dish) {
      throw new NotFoundException('Dish not found');
    }

    // Get ingredients with food details
    const ingredients = await this.dishIngredientRepository.findByDishId(id);

    console.log('=== DEBUG DISH INGREDIENTS ===');
    console.log('Total ingredients found:', ingredients.length);
    ingredients.forEach((ing, idx) => {
      console.log(`\nIngredient ${idx + 1}:`);
      console.log('  - ID:', ing.ID);
      console.log('  - INGREDIENT_ID:', ing.INGREDIENT_ID);
      console.log('  - WEIGHT:', ing.WEIGHT);
      console.log('  - Has FOOD:', !!ing.FOOD);
      if (ing.FOOD) {
        console.log('  - FOOD.ID:', ing.FOOD.ID);
        console.log('  - FOOD.NAME:', ing.FOOD.NAME);
        console.log('  - FOOD.ENERGY:', ing.FOOD.ENERGY);
        console.log('  - FOOD.PROTEIN:', ing.FOOD.PROTEIN);
      }
    });
    console.log('=== END DEBUG ===\n');

    // Calculate total nutrition
    const nutrition: NutritionInfoDto = {
      ENERGY: 0,
      WATER: 0,
      PROTEIN: 0,
      ANIMAL_PROTEIN: 0,
      VEGETABLE_PROTEIN: 0,
      FAT: 0,
      ANIMAL_FAT: 0,
      VEGETABLE_FAT: 0,
      STARCH_SUGAR: 0,
      FIBER: 0,
      MONO_UNSATURATED_FAT: 0,
      POLY_UNSATURATED_FAT: 0,
      TOTAL_UNSATURATED_FAT: 0,
      CHOLESTEROL: 0,
      SUGAR: 0,
    };

    const ingredientDetails: IngredientDetailDto[] = [];

    ingredients.forEach((ingredient) => {
      if (ingredient.FOOD && ingredient.WEIGHT) {
        const weight = parseFloat(String(ingredient.WEIGHT));
        const food = ingredient.FOOD;

        // Calculate nutrition values (weight * nutrition per 100g / 100)
        const multiplier = weight / 100;

        nutrition.ENERGY += (food.ENERGY || 0) * multiplier;
        nutrition.WATER += (food.WATER || 0) * multiplier;
        nutrition.PROTEIN += (food.PROTEIN || 0) * multiplier;
        nutrition.ANIMAL_PROTEIN += (food.ANIMAL_PROTEIN || 0) * multiplier;
        nutrition.VEGETABLE_PROTEIN +=
          (food.VEGETABLE_PROTEIN || 0) * multiplier;
        nutrition.FAT += (food.FAT || 0) * multiplier;
        nutrition.ANIMAL_FAT += (food.ANIMAL_FAT || 0) * multiplier;
        nutrition.VEGETABLE_FAT += (food.VEGETABLE_FAT || 0) * multiplier;
        nutrition.STARCH_SUGAR += (food.STARCH_SUGAR || 0) * multiplier;
        nutrition.FIBER += (food.FIBER || 0) * multiplier;
        nutrition.MONO_UNSATURATED_FAT +=
          (food.MONO_UNSATURATED_FAT || 0) * multiplier;
        nutrition.POLY_UNSATURATED_FAT +=
          (food.POLY_UNSATURATED_FAT || 0) * multiplier;
        nutrition.TOTAL_UNSATURATED_FAT +=
          (food.TOTAL_UNSATURATED_FAT || 0) * multiplier;
        nutrition.CHOLESTEROL += (food.CHOLESTEROL || 0) * multiplier;
        nutrition.SUGAR += (food.SUGAR || 0) * multiplier;

        ingredientDetails.push({
          ID: food.ID,
          NAME: food.NAME,
          WEIGHT: weight,
          PROCESSING_METHOD: ingredient.PROCESSING_METHOD,
          IMAGE: food.IMAGE || 'https://via.placeholder.com/150?text=No+Image',
          IMAGE_COOKED:
            food.IMAGE_COOKED ||
            'https://via.placeholder.com/150?text=No+Image',
        });
      }
    });

    // Round nutrition values to 2 decimal places
    Object.keys(nutrition).forEach((key) => {
      nutrition[key] = Math.round(nutrition[key] * 100) / 100;
    });

    return {
      ID: dish.ID,
      AGE_GROUP_ID: dish.AGE_GROUP_ID,
      NAME: dish.NAME,
      REGION_ID: dish.REGION_ID,
      COOKING_METHOD_ID: dish.COOKING_METHOD_ID,
      COOKING_METHOD_NAME: dish.COOKING_METHOD?.NAME,
      MEAL_STRUCTURE_ID: dish.MEAL_STRUCTURE_ID,
      SMALL_IMAGE:
        dish.SMALL_IMAGE || 'https://via.placeholder.com/300x200?text=No+Image',
      LARGE_IMAGE:
        dish.LARGE_IMAGE || 'https://via.placeholder.com/600x400?text=No+Image',
      STATUS: dish.STATUS,
      CREATED_AT: dish.CREATED_AT,
      COOKING_INSTRUCTION: dish.COOKING_INSTRUCTION || '',
      TIPS: dish.TIPS || '',
      ADDITIONAL_INFO: dish.ADDITIONAL_INFO || '',
      TAGS: dish.TAGS?.map((tag) => tag.TAG_NAME) || [],
      INGREDIENTS: ingredientDetails,
      NUTRITION: nutrition,
    };
  }
}
