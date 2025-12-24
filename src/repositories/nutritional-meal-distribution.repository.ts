import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NutritionalMealDistribution } from '../entities/nutritional-meal-distribution.entity';

/**
 * NutritionalMealDistributionRepository
 *
 * Handles database operations for meal-specific macronutrient distributions
 *
 * Business Logic:
 * - Retrieves protein, lipid, and glucid distribution for specific meals
 * - Used to calculate meal-specific nutritional requirements
 * - Links meal types with nutritional standards
 */
@Injectable()
export class NutritionalMealDistributionRepository {
  constructor(
    @InjectRepository(NutritionalMealDistribution)
    private readonly repository: Repository<NutritionalMealDistribution>,
  ) {}

  /**
   * Find all meal distributions for a specific nutritional standard
   *
   * @param nutritionalStandardId - ID of the nutritional standard
   * @returns Array of meal distributions with meal type information
   */
  async findByNutritionalStandardId(
    nutritionalStandardId: number,
  ): Promise<NutritionalMealDistribution[]> {
    return await this.repository.find({
      where: { NUTRITIONAL_STANDARD_ID: nutritionalStandardId },
      relations: ['MEAL_TYPE'],
      order: { MEAL_TYPE_ID: 'ASC' },
    });
  }

  /**
   * Find distribution for a specific meal type within a nutritional standard
   *
   * @param nutritionalStandardId - ID of the nutritional standard
   * @param mealTypeId - ID of the meal type
   * @returns Single meal distribution
   */
  async findByNutritionalStandardAndMealType(
    nutritionalStandardId: number,
    mealTypeId: number,
  ): Promise<NutritionalMealDistribution | null> {
    return await this.repository.findOne({
      where: {
        NUTRITIONAL_STANDARD_ID: nutritionalStandardId,
        MEAL_TYPE_ID: mealTypeId,
      },
      relations: ['MEAL_TYPE'],
    });
  }
}
