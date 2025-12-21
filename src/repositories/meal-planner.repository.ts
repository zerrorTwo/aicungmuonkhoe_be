import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { MealPlanner } from '../entities/meal-planner.entity';
import { CreateMealPlannerDto } from '../dtos/meal-planner.dto';

/**
 * MealPlannerRepository
 *
 * Handles database operations for meal planners
 *
 * Business Logic:
 * - Creates and manages meal plans for health documents
 * - Ensures uniqueness per health document and date
 * - Retrieves plans with all nested relations (meals, dishes)
 */
@Injectable()
export class MealPlannerRepository {
  constructor(
    @InjectRepository(MealPlanner)
    private readonly repository: Repository<MealPlanner>,
  ) {}

  /**
   * Create a new meal planner
   *
   * @param mealPlanner - Meal planner entity to create
   * @returns Created meal planner
   */
  async create(mealPlanner: Partial<MealPlanner>): Promise<MealPlanner> {
    const entity = this.repository.create(mealPlanner);
    return await this.repository.save(entity);
  }

  /**
   * Find meal planner by ID with all relations
   *
   * @param id - Meal planner ID
   * @returns Meal planner with meals and dishes
   */
  async findById(id: number): Promise<MealPlanner | null> {
    return await this.repository.findOne({
      where: { ID: id },
      relations: ['HEALTH_DOCUMENT'],
    });
  }

  /**
   * Find meal planner by health document and date
   *
   * @param healthDocumentId - Health document ID
   * @param planDate - Plan date (YYYY-MM-DD)
   * @returns Meal planner if exists
   */
  async findByHealthDocumentAndDate(
    healthDocumentId: number,
    planDate: string,
  ): Promise<MealPlanner | null> {
    return await this.repository.findOne({
      where: {
        HEALTH_DOCUMENT_ID: healthDocumentId,
        PLAN_DATE: planDate,
      },
      relations: ['HEALTH_DOCUMENT'],
    });
  }

  /**
   * Find all meal planners for a health document within date range
   *
   * @param healthDocumentId - Health document ID
   * @param startDate - Start date (optional)
   * @param endDate - End date (optional)
   * @returns Array of meal planners
   */
  async findByHealthDocumentAndDateRange(
    healthDocumentId: number,
    startDate?: string,
    endDate?: string,
  ): Promise<MealPlanner[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('mp')
      .leftJoinAndSelect('mp.HEALTH_DOCUMENT', 'healthDocument')
      .where('mp.HEALTH_DOCUMENT_ID = :healthDocumentId', { healthDocumentId });

    if (startDate && endDate) {
      queryBuilder.andWhere('mp.PLAN_DATE BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    } else if (startDate) {
      queryBuilder.andWhere('mp.PLAN_DATE >= :startDate', { startDate });
    } else if (endDate) {
      queryBuilder.andWhere('mp.PLAN_DATE <= :endDate', { endDate });
    }

    return await queryBuilder.orderBy('mp.PLAN_DATE', 'ASC').getMany();
  }

  /**
   * Update meal planner
   *
   * @param id - Meal planner ID
   * @param updates - Fields to update
   * @returns Updated meal planner
   */
  async update(
    id: number,
    updates: Partial<MealPlanner>,
  ): Promise<MealPlanner | null> {
    await this.repository.update(id, updates);
    return await this.findById(id);
  }

  /**
   * Delete meal planner
   * Cascades to meals and dishes
   *
   * @param id - Meal planner ID
   * @returns Deletion result
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
