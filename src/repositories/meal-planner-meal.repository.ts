import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MealPlannerMeal } from '../entities/meal-planner-meal.entity';

/**
 * MealPlannerMealRepository
 *
 * Handles database operations for individual meals within meal planners
 *
 * Business Logic:
 * - Manages meals (breakfast, lunch, snack, dinner) within a day's plan
 * - Tracks meal consumption status
 * - Retrieves meals with dish details
 */
@Injectable()
export class MealPlannerMealRepository {
  constructor(
    @InjectRepository(MealPlannerMeal)
    private readonly repository: Repository<MealPlannerMeal>,
  ) {}

  /**
   * Create a new meal within a meal planner
   *
   * @param meal - Meal entity to create
   * @returns Created meal
   */
  async create(meal: Partial<MealPlannerMeal>): Promise<MealPlannerMeal> {
    const entity = this.repository.create(meal);
    return await this.repository.save(entity);
  }

  /**
   * Find all meals for a meal planner
   *
   * @param mealPlannerId - Meal planner ID
   * @returns Array of meals with meal type information
   */
  async findByMealPlannerId(mealPlannerId: number): Promise<MealPlannerMeal[]> {
    return await this.repository.find({
      where: { MEAL_PLANNER_ID: mealPlannerId },
      relations: ['MEAL_TYPE'],
      order: { MEAL_ORDER: 'ASC' },
    });
  }

  /**
   * Find meal by ID
   *
   * @param id - Meal ID
   * @returns Meal with relations
   */
  async findById(id: number): Promise<MealPlannerMeal | null> {
    return await this.repository.findOne({
      where: { ID: id },
      relations: ['MEAL_TYPE', 'MEAL_PLANNER'],
    });
  }

  /**
   * Update meal (e.g., mark as eaten)
   *
   * @param id - Meal ID
   * @param updates - Fields to update
   * @returns Updated meal
   */
  async update(
    id: number,
    updates: Partial<MealPlannerMeal>,
  ): Promise<MealPlannerMeal | null> {
    await this.repository.update(id, updates);
    return await this.findById(id);
  }

  /**
   * Delete meal
   * Cascades to dishes
   *
   * @param id - Meal ID
   * @returns Deletion result
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Delete all meals for a meal planner
   *
   * @param mealPlannerId - Meal planner ID
   * @returns Number of deleted meals
   */
  async deleteByMealPlannerId(mealPlannerId: number): Promise<number> {
    const result = await this.repository.delete({
      MEAL_PLANNER_ID: mealPlannerId,
    });
    return result.affected ?? 0;
  }
}
