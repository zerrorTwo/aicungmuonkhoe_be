import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NutritionalIngredientDistribution } from '../entities/nutritional-ingredient-distribution.entity';

/**
 * NutritionalIngredientDistributionRepository
 *
 * Handles database operations for ingredient recommendations
 * (fruits, vegetables, salt intake)
 *
 * Business Logic:
 * - Retrieves daily and per-meal recommendations for specific ingredients
 * - Used for additional dietary guidance beyond macronutrients
 * - Important for micronutrient intake and health condition management
 */
@Injectable()
export class NutritionalIngredientDistributionRepository {
  constructor(
    @InjectRepository(NutritionalIngredientDistribution)
    private readonly repository: Repository<NutritionalIngredientDistribution>,
  ) {}

  /**
   * Find ingredient distribution for a specific nutritional standard
   *
   * @param nutritionalStandardId - ID of the nutritional standard
   * @returns Ingredient distribution recommendations
   */
  async findByNutritionalStandardId(
    nutritionalStandardId: number,
  ): Promise<NutritionalIngredientDistribution | null> {
    return await this.repository.findOne({
      where: { NUTRITIONAL_STANDARD_ID: nutritionalStandardId },
    });
  }
}
