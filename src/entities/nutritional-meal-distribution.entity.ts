import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NutritionalStandard } from './nutritional-standard.entity';
import { MealType } from './meal-type.entity';

/**
 * NutritionalMealDistribution Entity
 *
 * Represents how macronutrients should be distributed across different meals
 * Maps to the 'nutritional_meal_distribution' table in the database
 *
 * Business Logic:
 * - Defines Protein, Lipid (fat), and Glucid (carbohydrate) distribution per meal
 * - Each nutrient has:
 *   • Percentage range (min/max % of total daily intake)
 *   • Absolute amount range (min/max grams)
 * - Linked to a specific nutritional standard
 * - Linked to a specific meal type (breakfast, lunch, snack, dinner)
 *
 * Calculation Example:
 * - If daily protein requirement is 60g and breakfast should have 20-25% protein
 * - Then: PLG_P_PERCENT_MIN = 20, PLG_P_PERCENT_MAX = 25
 * - And: PLG_P_G_MIN = 12g, PLG_P_G_MAX = 15g
 *
 * Naming Convention:
 * - PLG = Protein/Lipid/Glucid
 * - P = Protein
 * - L = Lipid (Fat)
 * - G = Glucid (Carbohydrate)
 * - PERCENT = Percentage of daily intake
 * - G_MIN/G_MAX = Grams (minimum/maximum)
 */
@Entity('nutritional_meal_distribution')
export class NutritionalMealDistribution {
  /**
   * Auto-incrementing primary key
   */
  @PrimaryGeneratedColumn({ name: 'ID' })
  ID: number;

  /**
   * Reference to the parent nutritional standard
   * Defines which overall standard this distribution belongs to
   */
  @Column({ type: 'int', name: 'NUTRITIONAL_STANDARD_ID' })
  NUTRITIONAL_STANDARD_ID: number;

  @ManyToOne(() => NutritionalStandard, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'NUTRITIONAL_STANDARD_ID' })
  NUTRITIONAL_STANDARD: NutritionalStandard;

  /**
   * Meal type identifier
   * Specifies which meal this distribution applies to
   */
  @Column({ type: 'int', name: 'MEAL_TYPE_ID' })
  MEAL_TYPE_ID: number;

  @ManyToOne(() => MealType)
  @JoinColumn({ name: 'MEAL_TYPE_ID' })
  MEAL_TYPE: MealType;

  // ===== PROTEIN (P) DISTRIBUTION =====

  /**
   * Minimum protein percentage for this meal
   * Example: 20 means 20% of daily protein intake
   */
  @Column({ type: 'float', name: 'PLG_P_PERCENT_MIN', nullable: true })
  PLG_P_PERCENT_MIN: number;

  /**
   * Maximum protein percentage for this meal
   * Example: 25 means 25% of daily protein intake
   */
  @Column({ type: 'float', name: 'PLG_P_PERCENT_MAX', nullable: true })
  PLG_P_PERCENT_MAX: number;

  /**
   * Minimum protein amount in grams for this meal
   */
  @Column({ type: 'float', name: 'PLG_P_G_MIN', nullable: true })
  PLG_P_G_MIN: number;

  /**
   * Maximum protein amount in grams for this meal
   */
  @Column({ type: 'float', name: 'PLG_P_G_MAX', nullable: true })
  PLG_P_G_MAX: number;

  // ===== LIPID/FAT (L) DISTRIBUTION =====

  /**
   * Minimum lipid percentage for this meal
   * Example: 25 means 25% of daily fat intake
   */
  @Column({ type: 'float', name: 'PLG_L_PERCENT_MIN', nullable: true })
  PLG_L_PERCENT_MIN: number;

  /**
   * Maximum lipid percentage for this meal
   * Example: 30 means 30% of daily fat intake
   */
  @Column({ type: 'float', name: 'PLG_L_PERCENT_MAX', nullable: true })
  PLG_L_PERCENT_MAX: number;

  /**
   * Minimum lipid amount in grams for this meal
   */
  @Column({ type: 'float', name: 'PLG_L_G_MIN', nullable: true })
  PLG_L_G_MIN: number;

  /**
   * Maximum lipid amount in grams for this meal
   */
  @Column({ type: 'float', name: 'PLG_L_G_MAX', nullable: true })
  PLG_L_G_MAX: number;

  // ===== GLUCID/CARBOHYDRATE (G) DISTRIBUTION =====

  /**
   * Minimum glucid percentage for this meal
   * Example: 50 means 50% of daily carbohydrate intake
   */
  @Column({ type: 'float', name: 'PLG_G_PERCENT_MIN', nullable: true })
  PLG_G_PERCENT_MIN: number;

  /**
   * Maximum glucid percentage for this meal
   * Example: 60 means 60% of daily carbohydrate intake
   */
  @Column({ type: 'float', name: 'PLG_G_PERCENT_MAX', nullable: true })
  PLG_G_PERCENT_MAX: number;

  /**
   * Minimum glucid amount in grams for this meal
   */
  @Column({ type: 'float', name: 'PLG_G_G_MIN', nullable: true })
  PLG_G_G_MIN: number;

  /**
   * Maximum glucid amount in grams for this meal
   */
  @Column({ type: 'float', name: 'PLG_G_G_MAX', nullable: true })
  PLG_G_G_MAX: number;
}
