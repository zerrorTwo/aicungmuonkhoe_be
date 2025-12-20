import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NutritionalStandard } from './nutritional-standard.entity';

/**
 * NutritionalIngredientDistribution Entity
 *
 * Represents recommended daily intake of fruits, vegetables, and salt
 * Maps to the 'nutritional_ingredient_distribution' table in the database
 *
 * Business Logic:
 * - Defines specific ingredient recommendations per day and per meal
 * - Three main categories:
 *   1. Fruits - recommended daily and per-meal servings
 *   2. Vegetables - recommended daily and per-meal servings
 *   3. Salt - recommended daily and per-meal intake in grams
 *
 * - Meal abbreviations:
 *   • BS = Bữa Sáng (Breakfast)
 *   • BTR = Bữa Trưa (Lunch)
 *   • BC = Bữa Chiều (Afternoon snack)
 *   • BT = Bữa Tối (Dinner)
 *   • BP = Bữa Phụ (Additional snack)
 *   • DAY = Daily total
 *   • STRUCT = Structural/baseline amount
 *
 * - Linked to a specific nutritional standard
 * - Used for additional dietary recommendations beyond macronutrients
 * - Important for micronutrient intake and overall health
 */
@Entity('nutritional_ingredient_distribution')
export class NutritionalIngredientDistribution {
  /**
   * Auto-incrementing primary key
   */
  @PrimaryGeneratedColumn({ name: 'ID' })
  ID: number;

  /**
   * Reference to the parent nutritional standard
   */
  @Column({ type: 'int', name: 'NUTRITIONAL_STANDARD_ID' })
  NUTRITIONAL_STANDARD_ID: number;

  @ManyToOne(() => NutritionalStandard, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'NUTRITIONAL_STANDARD_ID' })
  NUTRITIONAL_STANDARD: NutritionalStandard;

  // ===== FRUIT RECOMMENDATIONS (servings or grams) =====

  /**
   * Total daily fruit recommendation
   * Typically measured in servings (1 serving ≈ 80-100g)
   */
  @Column({ type: 'float', name: 'STANDARD_DAY_FRUIT', default: 0 })
  STANDARD_DAY_FRUIT: number;

  /**
   * Fruit recommendation for breakfast
   */
  @Column({ type: 'float', name: 'STANDARD_BS_FRUIT', default: 0 })
  STANDARD_BS_FRUIT: number;

  /**
   * Fruit recommendation for lunch
   */
  @Column({ type: 'float', name: 'STANDARD_BTR_FRUIT', default: 0 })
  STANDARD_BTR_FRUIT: number;

  /**
   * Fruit recommendation for afternoon snack
   */
  @Column({ type: 'float', name: 'STANDARD_BC_FRUIT', default: 0 })
  STANDARD_BC_FRUIT: number;

  /**
   * Fruit recommendation for dinner
   */
  @Column({ type: 'float', name: 'STANDARD_BT_FRUIT', default: 0 })
  STANDARD_BT_FRUIT: number;

  // ===== VEGETABLE RECOMMENDATIONS (servings or grams) =====

  /**
   * Total daily vegetable recommendation
   * Typically measured in servings (1 serving ≈ 80-100g)
   */
  @Column({ type: 'float', name: 'STANDARD_DAY_VEGETABLE', default: 0 })
  STANDARD_DAY_VEGETABLE: number;

  /**
   * Vegetable recommendation for breakfast
   */
  @Column({ type: 'float', name: 'STANDARD_BS_VEGETABLE', default: 0 })
  STANDARD_BS_VEGETABLE: number;

  /**
   * Vegetable recommendation for lunch
   */
  @Column({ type: 'float', name: 'STANDARD_BTR_VEGETABLE', default: 0 })
  STANDARD_BTR_VEGETABLE: number;

  /**
   * Vegetable recommendation for afternoon snack
   */
  @Column({ type: 'float', name: 'STANDARD_BC_VEGETABLE', default: 0 })
  STANDARD_BC_VEGETABLE: number;

  /**
   * Vegetable recommendation for dinner
   */
  @Column({ type: 'float', name: 'STANDARD_BT_VEGETABLE', default: 0 })
  STANDARD_BT_VEGETABLE: number;

  // ===== SALT RECOMMENDATIONS (grams) =====

  /**
   * Structural/baseline salt recommendation
   * Base amount before meal-specific adjustments
   */
  @Column({ type: 'float', name: 'STANDARD_STRUCT_SALT', default: 0 })
  STANDARD_STRUCT_SALT: number;

  /**
   * Total daily salt recommendation in grams
   * WHO recommends <5g/day for adults
   * May be lower for hypertension or other conditions
   */
  @Column({ type: 'float', name: 'STANDARD_DAY_SALT', default: 0 })
  STANDARD_DAY_SALT: number;

  /**
   * Salt recommendation for breakfast in grams
   */
  @Column({ type: 'float', name: 'STANDARD_BS_SALT', default: 0 })
  STANDARD_BS_SALT: number;

  /**
   * Salt recommendation for lunch in grams
   */
  @Column({ type: 'float', name: 'STANDARD_BTR_SALT', default: 0 })
  STANDARD_BTR_SALT: number;

  /**
   * Salt recommendation for dinner in grams
   */
  @Column({ type: 'float', name: 'STANDARD_BT_SALT', default: 0 })
  STANDARD_BT_SALT: number;

  /**
   * Salt recommendation for additional snack in grams
   */
  @Column({ type: 'float', name: 'STANDARD_BP_SALT', default: 0 })
  STANDARD_BP_SALT: number;
}
