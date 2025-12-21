import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { MealPlannerRepository } from '../repositories/meal-planner.repository';
import { MealPlannerMealRepository } from '../repositories/meal-planner-meal.repository';
import { MealPlannerMealDishRepository } from '../repositories/meal-planner-meal-dish.repository';
import {
  CreateMealPlannerDto,
  MealPlannerResponseDto,
  UpdateMealPlannerDto,
} from '../dtos/meal-planner.dto';

/**
 * MealPlannerService
 *
 * Manages meal planning for health documents
 *
 * Business Logic:
 * - Creates custom meal plans with specific dishes
 * - Updates existing meal plans
 * - Retrieves meal plans with full details
 * - Tracks meal consumption (eaten/not eaten)
 * - Validates meal plan structure and contents
 */
@Injectable()
export class MealPlannerService {
  constructor(
    private readonly mealPlannerRepo: MealPlannerRepository,
    private readonly mealPlannerMealRepo: MealPlannerMealRepository,
    private readonly mealDishRepo: MealPlannerMealDishRepository,
  ) {}

  /**
   * Create a new meal plan for a health document
   *
   * @param createDto - Meal planner creation data
   * @param userId - User ID creating the plan
   * @returns Created meal planner with full details
   */
  async createMealPlanner(
    createDto: CreateMealPlannerDto,
    userId: number,
  ): Promise<MealPlannerResponseDto> {
    // Check if plan already exists for this date
    const existing = await this.mealPlannerRepo.findByHealthDocumentAndDate(
      createDto.healthDocumentId,
      createDto.planDate,
    );

    if (existing) {
      throw new BadRequestException(
        `Meal plan already exists for date ${createDto.planDate}`,
      );
    }

    // Create meal planner
    const mealPlanner = await this.mealPlannerRepo.create({
      HEALTH_DOCUMENT_ID: createDto.healthDocumentId,
      PLAN_DATE: createDto.planDate,
      CREATED_BY: userId,
      UPDATED_BY: userId,
    });

    // Create meals
    for (const mealDto of createDto.meals) {
      const meal = await this.mealPlannerMealRepo.create({
        MEAL_PLANNER_ID: mealPlanner.ID,
        MEAL_TYPE_CODE: mealDto.mealTypeCode,
        MEAL_ORDER: mealDto.mealOrder || 1,
        EATEN: 0,
        CREATED_BY: userId,
        UPDATED_BY: userId,
      });

      // Create dishes for this meal
      for (const dishDto of mealDto.dishes) {
        await this.mealDishRepo.create({
          MEAL_PLANNER_MEAL_ID: meal.ID,
          DISH_ID: dishDto.dishId,
          DISH_SALT_FORMULA_ID: dishDto.dishSaltFormulaId,
          CREATED_BY: userId,
          UPDATED_BY: userId,
        });
      }
    }

    // Fetch and return complete meal planner
    return await this.getMealPlannerById(mealPlanner.ID);
  }

  /**
   * Get meal planner by ID with all details
   *
   * @param id - Meal planner ID
   * @returns Complete meal planner with meals and dishes
   */
  async getMealPlannerById(id: number): Promise<MealPlannerResponseDto> {
    const mealPlanner = await this.mealPlannerRepo.findById(id);

    if (!mealPlanner) {
      throw new NotFoundException(`Meal planner with ID ${id} not found`);
    }

    // Fetch meals
    const meals = await this.mealPlannerMealRepo.findByMealPlannerId(id);

    // Fetch dishes for each meal
    const mealsWithDishes = await Promise.all(
      meals.map(async (meal) => {
        const dishes = await this.mealDishRepo.findByMealPlannerMealId(meal.ID);

        return {
          id: meal.ID,
          mealTypeCode: meal.MEAL_TYPE_CODE,
          mealTypeName: meal.MEAL_TYPE?.NAME || '',
          mealOrder: meal.MEAL_ORDER,
          eaten: meal.EATEN === 1,
          dishes: dishes.map((dish) => ({
            id: dish.ID,
            dishId: dish.DISH_ID,
            dishName: '', // Would need to join with dish table
            dishSaltFormulaId: dish.DISH_SALT_FORMULA_ID,
          })),
        };
      }),
    );

    return {
      id: mealPlanner.ID,
      healthDocumentId: mealPlanner.HEALTH_DOCUMENT_ID,
      planDate: mealPlanner.PLAN_DATE,
      meals: mealsWithDishes,
      createdAt: mealPlanner.CREATED_AT,
      updatedAt: mealPlanner.UPDATED_AT,
    };
  }

  /**
   * Get meal planners for a health document within a date range
   *
   * @param healthDocumentId - Health document ID
   * @param startDate - Start date (optional)
   * @param endDate - End date (optional)
   * @returns Array of meal planners
   */
  async getMealPlannersByHealthDocument(
    healthDocumentId: number,
    startDate?: string,
    endDate?: string,
  ): Promise<MealPlannerResponseDto[]> {
    const planners =
      await this.mealPlannerRepo.findByHealthDocumentAndDateRange(
        healthDocumentId,
        startDate,
        endDate,
      );

    return await Promise.all(
      planners.map((planner) => this.getMealPlannerById(planner.ID)),
    );
  }

  /**
   * Update a meal planner
   *
   * @param id - Meal planner ID
   * @param updateDto - Update data
   * @param userId - User ID performing update
   * @returns Updated meal planner
   */
  async updateMealPlanner(
    id: number,
    updateDto: UpdateMealPlannerDto,
    userId: number,
  ): Promise<MealPlannerResponseDto> {
    const existing = await this.mealPlannerRepo.findById(id);

    if (!existing) {
      throw new NotFoundException(`Meal planner with ID ${id} not found`);
    }

    // Update meals if provided
    if (updateDto.meals) {
      for (const mealDto of updateDto.meals) {
        if (mealDto.id) {
          // Update existing meal
          await this.mealPlannerMealRepo.update(mealDto.id, {
            EATEN: mealDto.eaten ? 1 : 0,
            UPDATED_BY: userId,
          });

          // Update dishes if provided
          if (mealDto.dishes) {
            // Delete existing dishes
            await this.mealDishRepo.deleteByMealPlannerMealId(mealDto.id);

            // Create new dishes
            for (const dishDto of mealDto.dishes) {
              await this.mealDishRepo.create({
                MEAL_PLANNER_MEAL_ID: mealDto.id,
                DISH_ID: dishDto.dishId,
                DISH_SALT_FORMULA_ID: dishDto.dishSaltFormulaId,
                CREATED_BY: userId,
                UPDATED_BY: userId,
              });
            }
          }
        }
      }
    }

    return await this.getMealPlannerById(id);
  }

  /**
   * Delete a meal planner
   *
   * @param id - Meal planner ID
   * @returns Success status
   */
  async deleteMealPlanner(id: number): Promise<boolean> {
    const existing = await this.mealPlannerRepo.findById(id);

    if (!existing) {
      throw new NotFoundException(`Meal planner with ID ${id} not found`);
    }

    return await this.mealPlannerRepo.delete(id);
  }

  /**
   * Mark a meal as eaten/not eaten
   *
   * @param mealId - Meal planner meal ID
   * @param eaten - Eaten status
   * @param userId - User ID performing update
   * @returns Updated meal
   */
  async markMealAsEaten(
    mealId: number,
    eaten: boolean,
    userId: number,
  ): Promise<void> {
    const meal = await this.mealPlannerMealRepo.findById(mealId);

    if (!meal) {
      throw new NotFoundException(`Meal with ID ${mealId} not found`);
    }

    await this.mealPlannerMealRepo.update(mealId, {
      EATEN: eaten ? 1 : 0,
      UPDATED_BY: userId,
    });
  }
}
