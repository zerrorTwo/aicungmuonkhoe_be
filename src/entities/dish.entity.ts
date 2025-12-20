import { Entity, PrimaryColumn, Column } from 'typeorm';

/**
 * Dish Entity
 *
 * Represents prepared dishes/recipes in the meal planning system
 * Maps to the 'dish' table in the database
 *
 * Business Logic:
 * - Each dish is designed for specific age groups
 * - Can be categorized by region, cooking method, and meal structure
 * - Contains cooking instructions and nutritional tips
 * - Status flag allows enabling/disabling dishes
 * - Used in meal planning for health documents
 * - Can have multiple ingredients (foods) with quantities
 */
@Entity('dish')
export class Dish {
  /**
   * Unique dish identifier
   */
  @PrimaryColumn({ type: 'varchar', length: 50, name: 'ID' })
  ID: string;

  /**
   * Dish name in Vietnamese
   */
  @Column({ type: 'varchar', length: 255, name: 'NAME' })
  NAME: string;

  /**
   * Target age group ID for this dish
   * References age_ranges table
   */
  @PrimaryColumn({ type: 'varchar', length: 50, name: 'AGE_GROUP_ID' })
  AGE_GROUP_ID: string;

  /**
   * Regional cuisine classification (optional)
   * Examples: Northern, Central, Southern Vietnamese cuisine
   */
  @Column({ type: 'varchar', length: 50, name: 'REGION_ID', nullable: true })
  REGION_ID: string;

  /**
   * External dish type IDs (comma-separated or JSON)
   * Can link to multiple dish types
   */
  @Column({
    type: 'varchar',
    length: 512,
    name: 'EXTERNAL_DISH_TYPE_ID',
    nullable: true,
  })
  EXTERNAL_DISH_TYPE_ID: string;

  /**
   * Cooking method IDs (comma-separated or JSON)
   * Examples: steaming, boiling, frying, grilling
   */
  @Column({
    type: 'varchar',
    length: 512,
    name: 'COOKING_METHOD_ID',
    nullable: true,
  })
  COOKING_METHOD_ID: string;

  /**
   * Meal structure IDs (comma-separated or JSON)
   * Indicates which meal types this dish is suitable for
   */
  @Column({
    type: 'varchar',
    length: 512,
    name: 'MEAL_STRUCTURE_ID',
    nullable: true,
  })
  MEAL_STRUCTURE_ID: string;

  /**
   * Small thumbnail image URL
   */
  @Column({ type: 'varchar', length: 255, name: 'SMALL_IMAGE', nullable: true })
  SMALL_IMAGE: string;

  /**
   * Large display image URL
   */
  @Column({ type: 'varchar', length: 255, name: 'LARGE_IMAGE', nullable: true })
  LARGE_IMAGE: string;

  /**
   * Step-by-step cooking instructions
   * Contains detailed preparation and cooking methods
   */
  @Column({ type: 'text', name: 'COOKING_INSTRUCTION', nullable: true })
  COOKING_INSTRUCTION: string;

  /**
   * Cooking tips and recommendations
   * Helpful advice for preparing the dish
   */
  @Column({ type: 'text', name: 'TIPS', nullable: true })
  TIPS: string;

  /**
   * Additional information about the dish
   * Can include nutritional benefits, substitutions, or variations
   */
  @Column({ type: 'text', name: 'ADDITIONAL_INFO', nullable: true })
  ADDITIONAL_INFO: string;

  /**
   * Status flag
   * 1 = active/available, 0 = inactive/hidden
   * Used to enable/disable dishes without deleting them
   */
  @Column({ type: 'tinyint', name: 'STATUS', default: 1, nullable: true })
  STATUS: number;

  /**
   * User ID who created this dish
   */
  @Column({ type: 'varchar', length: 50, name: 'CREATED_BY', nullable: true })
  CREATED_BY: string;

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
   * User ID who last updated this dish
   */
  @Column({ type: 'varchar', length: 50, name: 'UPDATED_BY', nullable: true })
  UPDATED_BY: string;

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
}
