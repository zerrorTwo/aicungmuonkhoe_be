import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * MealType Entity
 *
 * Represents different types of meals in a daily eating plan
 * Maps to the 'meal_types' table in the database
 *
 * Business Logic:
 * - Defines meal categories (breakfast, lunch, snack, dinner, etc.)
 * - Used for meal planning and energy distribution
 * - Each meal type has a unique code for easy reference
 * - Critical for calculating meal-specific nutritional requirements
 */
@Entity('meal_types')
export class MealType {
  /**
   * Auto-incrementing primary key
   */
  @PrimaryGeneratedColumn({ name: 'ID' })
  ID: number;

  /**
   * Unique code for the meal type
   * Examples: 'BS' (breakfast/bữa sáng), 'BTR' (lunch/bữa trưa),
   *           'BP' (snack/bữa phụ), 'BT' (dinner/bữa tối)
   */
  @Column({ type: 'varchar', length: 5, name: 'CODE', unique: true })
  CODE: string;

  /**
   * Display name of the meal type
   * Shown to users in Vietnamese or English
   * Examples: 'Bữa sáng', 'Breakfast', 'Bữa trưa', 'Lunch'
   */
  @Column({ type: 'varchar', length: 50, name: 'NAME' })
  NAME: string;
}
