import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { MealPlanner } from './meal-planner.entity';
import { MealType } from './meal-type.entity';

/**
 * MealPlannerMeal Entity
 *
 * Represents individual meals within a meal plan
 * Maps to the 'meal_planner_meals' table in the database
 *
 * Business Logic:
 * - Each meal belongs to a specific meal planner (date + health document)
 * - Identifies the meal type (breakfast, lunch, snack, dinner)
 * - Supports multiple meals of the same type via MEAL_ORDER
 *   Example: Two snacks in one day (order 1 and 2)
 * - Tracks whether the meal has been eaten (for compliance tracking)
 * - Contains multiple dishes via MealPlannerMealDish
 *
 * Use Cases:
 * - Standard 3-meal plan: breakfast, lunch, dinner
 * - Extended 4-meal plan: breakfast, lunch, snack, dinner
 * - Custom plans: multiple snacks, split meals, etc.
 */
@Entity('meal_planner_meals')
@Index(
  'unique_meal_planner_meal',
  ['MEAL_PLANNER_ID', 'MEAL_TYPE_CODE', 'MEAL_ORDER'],
  { unique: true },
)
export class MealPlannerMeal {
  /**
   * Auto-incrementing primary key
   */
  @PrimaryGeneratedColumn({ name: 'ID' })
  ID: number;

  /**
   * Parent meal planner ID
   * Links to meal_planners table
   */
  @Column({ type: 'int', name: 'MEAL_PLANNER_ID' })
  MEAL_PLANNER_ID: number;

  @ManyToOne(() => MealPlanner, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'MEAL_PLANNER_ID' })
  MEAL_PLANNER: MealPlanner;

  /**
   * Meal type code
   * Links to meal_types table
   * Examples: 'BS' (breakfast), 'BTR' (lunch), 'BP' (snack), 'BT' (dinner)
   */
  @Column({ type: 'varchar', length: 5, name: 'MEAL_TYPE_CODE' })
  MEAL_TYPE_CODE: string;

  @ManyToOne(() => MealType, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'MEAL_TYPE_CODE', referencedColumnName: 'CODE' })
  MEAL_TYPE: MealType;

  /**
   * Order of this meal within the same type
   * Allows multiple meals of the same type (e.g., two snacks)
   * Default: 1 (first/only meal of this type)
   */
  @Column({ type: 'int', name: 'MEAL_ORDER', default: 1 })
  MEAL_ORDER: number;

  /**
   * Whether this meal has been consumed
   * 0 = not eaten yet, 1 = eaten
   * Used for tracking adherence to meal plan
   */
  @Column({ type: 'tinyint', name: 'EATEN', default: 0 })
  EATEN: number;

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
   * User ID who created this meal entry
   */
  @Column({ type: 'int', name: 'CREATED_BY' })
  CREATED_BY: number;

  /**
   * User ID who last updated this meal entry
   */
  @Column({ type: 'int', name: 'UPDATED_BY' })
  UPDATED_BY: number;
}
