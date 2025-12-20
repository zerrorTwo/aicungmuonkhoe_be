import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { HealthDocument } from './health-document.entity';

/**
 * MealPlanner Entity
 *
 * Represents a meal plan for a specific health document on a specific date
 * Maps to the 'meal_planners' table in the database
 *
 * Business Logic:
 * - Each meal planner is unique per health document and date
 * - One health document can have multiple meal plans (different dates)
 * - Contains multiple meals (breakfast, lunch, snack, dinner)
 * - Used to organize daily eating plans for individuals or family members
 * - Tracks who created/updated the plan for audit purposes
 *
 * Workflow:
 * 1. Create MealPlanner for a health document and date
 * 2. Add MealPlannerMeal entries (one per meal type)
 * 3. Add MealPlannerMealDish entries (dishes for each meal)
 * 4. Track meal consumption status (eaten/not eaten)
 */
@Entity('meal_planners')
@Index('unique_meal_planner', ['HEALTH_DOCUMENT_ID', 'PLAN_DATE'], {
  unique: true,
})
export class MealPlanner {
  /**
   * Auto-incrementing primary key
   */
  @PrimaryGeneratedColumn({ name: 'ID' })
  ID: number;

  /**
   * Health document identifier
   * Links to health_document table
   * Specifies which person this meal plan is for
   */
  @Column({ type: 'int', name: 'HEALTH_DOCUMENT_ID' })
  HEALTH_DOCUMENT_ID: number;

  @ManyToOne(() => HealthDocument, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'HEALTH_DOCUMENT_ID' })
  HEALTH_DOCUMENT: HealthDocument;

  /**
   * Date for this meal plan
   * Format: YYYY-MM-DD
   * Each health document can only have one plan per date
   */
  @Column({ type: 'date', name: 'PLAN_DATE' })
  PLAN_DATE: string;

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
   * User ID who created this meal plan
   */
  @Column({ type: 'int', name: 'CREATED_BY' })
  CREATED_BY: number;

  /**
   * User ID who last updated this meal plan
   */
  @Column({ type: 'int', name: 'UPDATED_BY' })
  UPDATED_BY: number;
}
