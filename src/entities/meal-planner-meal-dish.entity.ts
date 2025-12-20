import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { MealPlannerMeal } from './meal-planner-meal.entity';

/**
 * MealPlannerMealDish Entity
 *
 * Represents dishes assigned to a specific meal in the meal plan
 * Maps to the 'meal_planner_meal_dishes' table in the database
 *
 * Business Logic:
 * - Links dishes to meals in the meal planning system
 * - Each meal can have multiple dishes
 * - References both DISH_ID and DISH_SALT_FORMULA_ID
 * - DISH_SALT_FORMULA_ID represents specific preparation with salt/seasoning amounts
 * - Ensures variety and balanced nutrition across the meal
 *
 * Salt Formula Purpose:
 * - Same dish can have different salt formulas for different health conditions
 * - Example: "Canh chua" (sour soup) may have:
 *   • Low-salt version for hypertension patients
 *   • Normal-salt version for regular diet
 *   • Custom version for specific dietary needs
 *
 * Workflow:
 * 1. Select appropriate dishes for meal type and user profile
 * 2. Choose salt formula based on health status and recommendations
 * 3. Add dish with its formula to the meal
 * 4. Calculate total nutritional values from all dishes
 */
@Entity('meal_planner_meal_dishes')
@Index('unique_meal_dish', ['MEAL_PLANNER_MEAL_ID', 'DISH_SALT_FORMULA_ID'], {
  unique: true,
})
export class MealPlannerMealDish {
  /**
   * Auto-incrementing primary key
   */
  @PrimaryGeneratedColumn({ name: 'ID' })
  ID: number;

  /**
   * Parent meal ID
   * Links to meal_planner_meals table
   */
  @Column({ type: 'int', name: 'MEAL_PLANNER_MEAL_ID' })
  MEAL_PLANNER_MEAL_ID: number;

  @ManyToOne(() => MealPlannerMeal, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'MEAL_PLANNER_MEAL_ID' })
  MEAL_PLANNER_MEAL: MealPlannerMeal;

  /**
   * Dish identifier
   * Links to dish table
   * Specifies which recipe/dish is included
   */
  @Column({ type: 'varchar', length: 50, name: 'DISH_ID' })
  DISH_ID: string;

  /**
   * Dish salt formula identifier
   * Links to dish_salt_formula table
   * Specifies the exact preparation/seasoning variant
   * Includes salt amount, portion size, and ingredient quantities
   */
  @Column({ type: 'varchar', length: 50, name: 'DISH_SALT_FORMULA_ID' })
  DISH_SALT_FORMULA_ID: string;

  /**
   * Record creation timestamp
   */
  @Column({
    type: 'timestamp',
    name: 'CREATED_AT',
    default: () => 'CURRENT_TIMESTAMP',
  })
  CREATED_AT: Date;

  /**
   * Last update timestamp
   */
  @Column({
    type: 'timestamp',
    name: 'UPDATED_AT',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  UPDATED_AT: Date;

  /**
   * User ID who created this dish assignment
   */
  @Column({ type: 'int', name: 'CREATED_BY' })
  CREATED_BY: number;

  /**
   * User ID who last updated this dish assignment
   */
  @Column({ type: 'int', name: 'UPDATED_BY' })
  UPDATED_BY: number;
}
