import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Brackets } from 'typeorm';
import { FoodRecommendation } from '../entities/food-recommendation.entity';
import { Food } from '../entities/food.entity';
import { TypeAdvice } from '../dtos/food-recommendation.dto';

interface FindWithFiltersParams {
  healthStatusId: string;
  typeAdvice: TypeAdvice;
  search?: string;
  foodGroups?: string[];
  fatLevels?: string[];
  giLevels?: string[];
  page: number;
  limit: number;
}

/**
 * FoodRecommendationRepository
 *
 * Handles database operations for food recommendations
 *
 * Business Logic:
 * - Joins food_recommendation with foods table
 * - Supports complex filtering (search, groups, fat levels, GI levels)
 * - Returns foods with full nutritional information
 */
@Injectable()
export class FoodRecommendationRepository {
  constructor(
    @InjectRepository(FoodRecommendation)
    private readonly recommendationRepo: Repository<FoodRecommendation>,
    @InjectRepository(Food)
    private readonly foodRepo: Repository<Food>,
  ) {}

  /**
   * Find foods with complex filters
   *
   * Process:
   * 1. Join hm_health_food_recommendation with foods
   * 2. Filter by health status and type advice
   * 3. Apply search filter (multiple keywords)
   * 4. Apply food group filter
   * 5. Apply fat level filter (only for protein/nuts groups)
   * 6. Apply GI level filter (only for starch/fruits/vegetables groups)
   * 7. Return foods with count
   *
   * @param params - Filter parameters
   * @returns Foods and total count
   */
  async findWithFilters(
    params: FindWithFiltersParams,
  ): Promise<{ foods: Food[]; total: number }> {
    const query = this.foodRepo
      .createQueryBuilder('food')
      .innerJoin(
        'hm_health_food_recommendation',
        'rec',
        'rec.FOOD_ID = food.ID',
      )
      .where('rec.HEALTH_STATUS_ID = :healthStatusId', {
        healthStatusId: params.healthStatusId,
      });

    // Filter by type advice
    if (params.typeAdvice === TypeAdvice.NENAN) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where("rec.TYPE_ADVICE = 'NENAN'")
            .orWhere("rec.TYPE_ADVICE = 'EAT'")
            .orWhere("rec.TYPE_ADVICE = 'RECOMMENDED'");
        }),
      );
    } else if (params.typeAdvice === TypeAdvice.HANCHEAN) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where("rec.TYPE_ADVICE = 'HANCHEAN'")
            .orWhere("rec.TYPE_ADVICE = 'LIMIT'")
            .orWhere("rec.TYPE_ADVICE = 'AVOID'");
        }),
      );
    }

    // Search filter (multiple keywords support)
    if (params.search && params.search.trim()) {
      const keywords = params.search
        .split(/[,/]/)
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      if (keywords.length > 0) {
        query.andWhere(
          new Brackets((qb) => {
            keywords.forEach((keyword, index) => {
              if (index === 0) {
                qb.where('food.NAME LIKE :keyword0', {
                  keyword0: `%${keyword}%`,
                });
              } else {
                qb.orWhere(`food.NAME LIKE :keyword${index}`, {
                  [`keyword${index}`]: `%${keyword}%`,
                });
              }
            });
          }),
        );
      }
    }

    // Food group filter
    if (params.foodGroups && params.foodGroups.length > 0) {
      query.andWhere('food.GROUP_FOOD IN (:...foodGroups)', {
        foodGroups: params.foodGroups,
      });
    }

    // Fat level filter (only applies to protein and nuts groups)
    if (params.fatLevels && params.fatLevels.length > 0) {
      const proteinOrNutsSelected =
        params.foodGroups &&
        (params.foodGroups.includes('THUCPHAMGIAUCHATDAM') ||
          params.foodGroups.includes('HATDAUMOBO'));

      if (proteinOrNutsSelected) {
        query.andWhere('food.PROTEIN_CLASSIFICATION IN (:...fatLevels)', {
          fatLevels: params.fatLevels,
        });
      }
    }

    // GI level filter (applies to starch, vegetables, and fruits groups)
    if (params.giLevels && params.giLevels.length > 0) {
      const giApplicableGroups = params.foodGroups?.filter((g) =>
        ['THUCPHAMGIAUCHATBOTDUONG', 'RAUCUQUA', 'TRAICAY'].includes(g),
      );

      if (giApplicableGroups && giApplicableGroups.length > 0) {
        query.andWhere(
          new Brackets((qb) => {
            // For starch and vegetables: use SUGAR_CLASSIFICATION
            if (
              giApplicableGroups.includes('THUCPHAMGIAUCHATBOTDUONG') ||
              giApplicableGroups.includes('RAUCUQUA')
            ) {
              qb.where('food.SUGAR_CLASSIFICATION IN (:...giLevels)', {
                giLevels: params.giLevels,
              });
            }

            // For fruits: use FRUIT_CLASSIFICATION
            if (giApplicableGroups.includes('TRAICAY')) {
              if (
                giApplicableGroups.includes('THUCPHAMGIAUCHATBOTDUONG') ||
                giApplicableGroups.includes('RAUCUQUA')
              ) {
                qb.orWhere('food.FRUIT_CLASSIFICATION IN (:...giLevels)', {
                  giLevels: params.giLevels,
                });
              } else {
                qb.where('food.FRUIT_CLASSIFICATION IN (:...giLevels)', {
                  giLevels: params.giLevels,
                });
              }
            }
          }),
        );
      }
    }

    // Get total count
    const total = await query.getCount();

    // Get foods (without pagination here, will be done in service after sorting)
    const foods = await query.getMany();

    return { foods, total };
  }
}
