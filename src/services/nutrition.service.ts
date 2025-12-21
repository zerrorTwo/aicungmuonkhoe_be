import { Injectable, NotFoundException } from '@nestjs/common';
import { NutritionalStandardRepository } from '../repositories/nutritional-standard.repository';
import { NutritionalMealDistributionRepository } from '../repositories/nutritional-meal-distribution.repository';
import { NutritionalIngredientDistributionRepository } from '../repositories/nutritional-ingredient-distribution.repository';
import { HealthDocumentRepository } from '../repositories/health-document.repository';
import {
  NutritionalStandardResponseDto,
  MealEnergyDistributionDto,
  MacronutrientDistributionDto,
  IngredientRecommendationDto,
} from '../dtos/nutrition.dto';

/**
 * NutritionService
 *
 * Provides comprehensive nutritional consultation services
 *
 * Business Logic:
 * - Calculates daily nutritional requirements based on user profile
 * - Distributes energy and macronutrients across meals
 * - Provides fruit, vegetable, and salt recommendations
 * - Supports both 3-meal and 4-meal structures
 *
 * Key Features:
 * 1. Daily Nutrition Standards - complete nutritional requirements
 * 2. Meal Energy Distribution - how energy is split across meals
 * 3. Macronutrient Distribution - protein, fat, carbs per meal
 * 4. Ingredient Recommendations - fruits, vegetables, salt limits
 */
@Injectable()
export class NutritionService {
  constructor(
    private readonly nutritionalStandardRepo: NutritionalStandardRepository,
    private readonly mealDistributionRepo: NutritionalMealDistributionRepository,
    private readonly ingredientDistributionRepo: NutritionalIngredientDistributionRepository,
    private readonly healthDocumentRepo: HealthDocumentRepository,
  ) {}

  /**
   * Get complete nutritional standards for a health document
   *
   * This is the main method that calculates all nutritional requirements
   * based on the user's health document information
   *
   * @param healthDocumentId - ID of the health document
   * @param mealStructure - 3 or 4 meals (default: 3)
   * @returns Complete nutritional standard with meal distributions
   */
  async getNutritionByHealthDocument(
    healthDocumentId: number,
    mealStructure: number = 3,
  ): Promise<NutritionalStandardResponseDto> {
    // Fetch health document with all relations
    const healthDoc = await this.healthDocumentRepo.findById(healthDocumentId);

    if (!healthDoc) {
      throw new NotFoundException(
        `Health document with ID ${healthDocumentId} not found`,
      );
    }

    // Extract criteria from health document
    const criteria = {
      // Age range should be calculated from DOB
      genderId: healthDoc.GENDER?.ID,
      weight: parseFloat(healthDoc.WEIGHT || '0'),
      healthStatusId: healthDoc.HEALTH_STATUS,
      physicalActivityId: healthDoc.EXERCISE_INTENSITY?.ID,
    };

    // Find appropriate nutritional standard
    const standard =
      await this.nutritionalStandardRepo.findByCriteria(criteria);

    if (!standard) {
      throw new NotFoundException(
        'No nutritional standard found matching your profile',
      );
    }

    // Build complete response
    return await this.buildNutritionalResponse(standard, mealStructure);
  }

  /**
   * Build complete nutritional response with all distributions
   *
   * @param standard - Nutritional standard entity
   * @param mealStructure - 3 or 4 meals
   * @returns Formatted response DTO
   */
  private async buildNutritionalResponse(
    standard: any,
    mealStructure: number,
  ): Promise<NutritionalStandardResponseDto> {
    // Calculate daily totals
    const dailyEnergy = this.calculateDailyEnergy(standard, mealStructure);
    const { protein, lipid, glucid } = this.calculateDailyMacros(dailyEnergy);

    // Get meal distributions
    const mealEnergyDist = this.getMealEnergyDistribution(
      standard,
      mealStructure,
    );
    const macroDist = await this.getMacronutrientDistribution(standard.ID);
    const ingredientRec = await this.getIngredientRecommendations(standard.ID);

    return {
      id: standard.ID,
      dailyEnergy,
      dailyProtein: protein,
      dailyLipid: lipid,
      dailyGlucid: glucid,
      mealStructure,
      mealDistribution: mealEnergyDist,
      macronutrientDistribution: macroDist,
      ingredientRecommendations: ingredientRec,
    };
  }

  /**
   * Calculate total daily energy requirement
   *
   * Sums up energy from all meals based on meal structure
   *
   * @param standard - Nutritional standard
   * @param mealStructure - 3 or 4 meals
   * @returns Total daily energy in kcal
   */
  private calculateDailyEnergy(standard: any, mealStructure: number): number {
    if (mealStructure === 3) {
      return (
        (standard.ENERGY_STANDARD_3_BS_MIN +
          standard.ENERGY_STANDARD_3_BS_MAX) /
          2 +
        (standard.ENERGY_STANDARD_3_BTR_MIN +
          standard.ENERGY_STANDARD_3_BTR_MAX) /
          2 +
        (standard.ENERGY_STANDARD_3_BT_MIN +
          standard.ENERGY_STANDARD_3_BT_MAX) /
          2
      );
    } else {
      return (
        (standard.ENERGY_STANDARD_4_BS_MIN +
          standard.ENERGY_STANDARD_4_BS_MAX) /
          2 +
        (standard.ENERGY_STANDARD_4_BTR_MIN +
          standard.ENERGY_STANDARD_4_BTR_MAX) /
          2 +
        (standard.ENERGY_STANDARD_4_BT_MIN +
          standard.ENERGY_STANDARD_4_BT_MAX) /
          2 +
        (standard.ENERGY_STANDARD_4_BP_MIN +
          standard.ENERGY_STANDARD_4_BP_MAX) /
          2
      );
    }
  }

  /**
   * Calculate daily macronutrient requirements
   *
   * Uses standard ratios:
   * - Protein: 15% of energy (4 kcal/g)
   * - Lipid: 25% of energy (9 kcal/g)
   * - Glucid: 60% of energy (4 kcal/g)
   *
   * @param dailyEnergy - Total daily energy in kcal
   * @returns Object with protein, lipid, glucid in grams
   */
  private calculateDailyMacros(dailyEnergy: number): {
    protein: number;
    lipid: number;
    glucid: number;
  } {
    return {
      protein: (dailyEnergy * 0.15) / 4, // 15% of energy, 4 kcal per gram
      lipid: (dailyEnergy * 0.25) / 9, // 25% of energy, 9 kcal per gram
      glucid: (dailyEnergy * 0.6) / 4, // 60% of energy, 4 kcal per gram
    };
  }

  /**
   * Get energy distribution across meals
   *
   * @param standard - Nutritional standard
   * @param mealStructure - 3 or 4 meals
   * @returns Array of meal energy distributions
   */
  private getMealEnergyDistribution(
    standard: any,
    mealStructure: number,
  ): MealEnergyDistributionDto[] {
    const distributions: MealEnergyDistributionDto[] = [];
    const dailyEnergy = this.calculateDailyEnergy(standard, mealStructure);

    if (mealStructure === 3) {
      // Breakfast
      distributions.push({
        mealTypeCode: 'BS',
        mealTypeName: 'Bữa sáng',
        energyMin: standard.ENERGY_STANDARD_3_BS_MIN,
        energyMax: standard.ENERGY_STANDARD_3_BS_MAX,
        energyPercentage:
          ((standard.ENERGY_STANDARD_3_BS_MIN +
            standard.ENERGY_STANDARD_3_BS_MAX) /
            2 /
            dailyEnergy) *
          100,
      });

      // Lunch
      distributions.push({
        mealTypeCode: 'BTR',
        mealTypeName: 'Bữa trưa',
        energyMin: standard.ENERGY_STANDARD_3_BTR_MIN,
        energyMax: standard.ENERGY_STANDARD_3_BTR_MAX,
        energyPercentage:
          ((standard.ENERGY_STANDARD_3_BTR_MIN +
            standard.ENERGY_STANDARD_3_BTR_MAX) /
            2 /
            dailyEnergy) *
          100,
      });

      // Dinner
      distributions.push({
        mealTypeCode: 'BT',
        mealTypeName: 'Bữa tối',
        energyMin: standard.ENERGY_STANDARD_3_BT_MIN,
        energyMax: standard.ENERGY_STANDARD_3_BT_MAX,
        energyPercentage:
          ((standard.ENERGY_STANDARD_3_BT_MIN +
            standard.ENERGY_STANDARD_3_BT_MAX) /
            2 /
            dailyEnergy) *
          100,
      });
    } else {
      // 4-meal structure (includes snack)
      distributions.push(
        {
          mealTypeCode: 'BS',
          mealTypeName: 'Bữa sáng',
          energyMin: standard.ENERGY_STANDARD_4_BS_MIN,
          energyMax: standard.ENERGY_STANDARD_4_BS_MAX,
          energyPercentage:
            ((standard.ENERGY_STANDARD_4_BS_MIN +
              standard.ENERGY_STANDARD_4_BS_MAX) /
              2 /
              dailyEnergy) *
            100,
        },
        {
          mealTypeCode: 'BTR',
          mealTypeName: 'Bữa trưa',
          energyMin: standard.ENERGY_STANDARD_4_BTR_MIN,
          energyMax: standard.ENERGY_STANDARD_4_BTR_MAX,
          energyPercentage:
            ((standard.ENERGY_STANDARD_4_BTR_MIN +
              standard.ENERGY_STANDARD_4_BTR_MAX) /
              2 /
              dailyEnergy) *
            100,
        },
        {
          mealTypeCode: 'BP',
          mealTypeName: 'Bữa phụ',
          energyMin: standard.ENERGY_STANDARD_4_BP_MIN,
          energyMax: standard.ENERGY_STANDARD_4_BP_MAX,
          energyPercentage:
            ((standard.ENERGY_STANDARD_4_BP_MIN +
              standard.ENERGY_STANDARD_4_BP_MAX) /
              2 /
              dailyEnergy) *
            100,
        },
        {
          mealTypeCode: 'BT',
          mealTypeName: 'Bữa tối',
          energyMin: standard.ENERGY_STANDARD_4_BT_MIN,
          energyMax: standard.ENERGY_STANDARD_4_BT_MAX,
          energyPercentage:
            ((standard.ENERGY_STANDARD_4_BT_MIN +
              standard.ENERGY_STANDARD_4_BT_MAX) /
              2 /
              dailyEnergy) *
            100,
        },
      );
    }

    return distributions;
  }

  /**
   * Get macronutrient distribution per meal
   *
   * @param nutritionalStandardId - Standard ID
   * @returns Array of macronutrient distributions per meal
   */
  private async getMacronutrientDistribution(
    nutritionalStandardId: number,
  ): Promise<MacronutrientDistributionDto[]> {
    const distributions =
      await this.mealDistributionRepo.findByNutritionalStandardId(
        nutritionalStandardId,
      );

    return distributions.map((dist) => ({
      mealTypeCode: dist.MEAL_TYPE?.CODE || '',
      mealTypeName: dist.MEAL_TYPE?.NAME || '',
      protein: {
        min: dist.PLG_P_G_MIN || 0,
        max: dist.PLG_P_G_MAX || 0,
        percentage: `${dist.PLG_P_PERCENT_MIN || 0}-${dist.PLG_P_PERCENT_MAX || 0}%`,
      },
      lipid: {
        min: dist.PLG_L_G_MIN || 0,
        max: dist.PLG_L_G_MAX || 0,
        percentage: `${dist.PLG_L_PERCENT_MIN || 0}-${dist.PLG_L_PERCENT_MAX || 0}%`,
      },
      glucid: {
        min: dist.PLG_G_G_MIN || 0,
        max: dist.PLG_G_G_MAX || 0,
        percentage: `${dist.PLG_G_PERCENT_MIN || 0}-${dist.PLG_G_PERCENT_MAX || 0}%`,
      },
    }));
  }

  /**
   * Get ingredient recommendations (fruits, vegetables, salt)
   *
   * @param nutritionalStandardId - Standard ID
   * @returns Ingredient recommendations
   */
  private async getIngredientRecommendations(
    nutritionalStandardId: number,
  ): Promise<IngredientRecommendationDto> {
    const dist =
      await this.ingredientDistributionRepo.findByNutritionalStandardId(
        nutritionalStandardId,
      );

    if (!dist) {
      // Return defaults if no specific recommendations
      return {
        dailyFruit: 0,
        dailyVegetable: 0,
        dailySalt: 5, // WHO recommendation
        fruitPerMeal: {},
        vegetablePerMeal: {},
        saltPerMeal: {},
      };
    }

    return {
      dailyFruit: dist.STANDARD_DAY_FRUIT,
      dailyVegetable: dist.STANDARD_DAY_VEGETABLE,
      dailySalt: dist.STANDARD_DAY_SALT,
      fruitPerMeal: {
        BS: dist.STANDARD_BS_FRUIT,
        BTR: dist.STANDARD_BTR_FRUIT,
        BC: dist.STANDARD_BC_FRUIT,
        BT: dist.STANDARD_BT_FRUIT,
      },
      vegetablePerMeal: {
        BS: dist.STANDARD_BS_VEGETABLE,
        BTR: dist.STANDARD_BTR_VEGETABLE,
        BC: dist.STANDARD_BC_VEGETABLE,
        BT: dist.STANDARD_BT_VEGETABLE,
      },
      saltPerMeal: {
        BS: dist.STANDARD_BS_SALT,
        BTR: dist.STANDARD_BTR_SALT,
        BT: dist.STANDARD_BT_SALT,
        BP: dist.STANDARD_BP_SALT,
      },
    };
  }
}
