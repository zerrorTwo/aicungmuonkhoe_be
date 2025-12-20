import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * FoodRecommendation Entity
 *
 * Represents food recommendations based on health conditions
 * Maps to the 'hm_health_food_recommendation' table in the database
 *
 * Business Logic:
 * - Each recommendation links a food to a health status
 * - TYPE_ADVICE specifies whether to eat or limit the food
 * - Helps users make informed dietary choices based on their health conditions
 * - Examples:
 *   • Diabetes: Recommend whole grains, limit simple sugars
 *   • Hypertension: Recommend low-sodium foods, limit salt
 *   • Pregnancy: Recommend folate-rich foods, limit caffeine
 *
 * TYPE_ADVICE values (typical):
 * - "EAT" or "RECOMMENDED" - foods to include in diet
 * - "LIMIT" or "AVOID" - foods to restrict or avoid
 */
@Entity('hm_health_food_recommendation')
export class FoodRecommendation {
  /**
   * Auto-incrementing primary key
   */
  @PrimaryGeneratedColumn({ name: 'ID' })
  ID: number;

  /**
   * Health status identifier
   * Links to hm_health_status table
   * Specifies which health condition this recommendation is for
   */
  @Column({ type: 'varchar', length: 50, name: 'HEALTH_STATUS_ID' })
  HEALTH_STATUS_ID: string;

  /**
   * Food identifier
   * Links to foods table
   * Specifies which food this recommendation is about
   */
  @Column({ type: 'int', name: 'FOOD_ID' })
  FOOD_ID: number;

  /**
   * Food name (denormalized for quick access)
   * Stored here to avoid joins when displaying recommendations
   */
  @Column({ type: 'varchar', length: 255, name: 'FOOD_NAME', nullable: true })
  FOOD_NAME: string;

  /**
   * Type of advice for this food-health combination
   * Examples: "EAT", "RECOMMENDED", "LIMIT", "AVOID"
   * Indicates whether to include or restrict this food
   */
  @Column({ type: 'varchar', length: 255, name: 'TYPE_ADVICE', nullable: true })
  TYPE_ADVICE: string;

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
   * User ID who created this recommendation
   */
  @Column({ type: 'int', name: 'CREATED_BY', nullable: true })
  CREATED_BY: number;

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
   * User ID who last updated this recommendation
   */
  @Column({ type: 'int', name: 'UPDATED_BY', nullable: true })
  UPDATED_BY: number;
}
