import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MealPlannerMealDish } from '../entities/meal-planner-meal-dish.entity';

/**
 * MealPlannerMealDishRepository
 *
 * Handles database operations for dishes within meals
 *
 * Business Logic:
 * - Manages dish assignments to meals
 * - Links dishes with their salt formulas
 * - Enables meal nutritional calculations
 */
@Injectable()
export class MealPlannerMealDishRepository {
  constructor(
    @InjectRepository(MealPlannerMealDish)
    private readonly repository: Repository<MealPlannerMealDish>,
  ) {}

  /**
   * Create a new dish assignment to a meal
   *
   * @param dish - Dish entity to create
   * @returns Created dish assignment
   */
  async create(
    dish: Partial<MealPlannerMealDish>,
  ): Promise<MealPlannerMealDish> {
    const entity = this.repository.create(dish);
    return await this.repository.save(entity);
  }

  /**
   * Find all dishes for a meal
   *
   * @param mealPlannerId - Meal planner meal ID
   * @returns Array of dishes
   */
  async findByMealPlannerMealId(
    mealPlannerMealId: number,
  ): Promise<MealPlannerMealDish[]> {
    return await this.repository.find({
      where: { MEAL_PLANNER_MEAL_ID: mealPlannerMealId },
    });
  }

  /**
   * Find dish by ID
   *
   * @param id - Dish assignment ID
   * @returns Dish assignment
   */
  async findById(id: number): Promise<MealPlannerMealDish | null> {
    return await this.repository.findOne({
      where: { ID: id },
    });
  }

  /**
   * Delete dish from meal
   *
   * @param id - Dish assignment ID
   * @returns Deletion result
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Delete all dishes for a meal
   *
   * @param mealPlannerMealId - Meal planner meal ID
   * @returns Number of deleted dishes
   */
  async deleteByMealPlannerMealId(mealPlannerMealId: number): Promise<number> {
    const result = await this.repository.delete({
      MEAL_PLANNER_MEAL_ID: mealPlannerMealId,
    });
    return result.affected ?? 0;
  }
}
