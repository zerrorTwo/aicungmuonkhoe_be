import { Entity, PrimaryColumn, Column } from 'typeorm';

/**
 * AgeRange Entity
 *
 * Represents age ranges used for nutritional standard calculations
 * Maps to the 'age_ranges' table in the database
 *
 * Business Logic:
 * - Each age range has a unique ID (e.g., 'A1', 'A2', etc.)
 * - Used to categorize users and determine appropriate nutritional standards
 * - Linked with nutritional standards for personalized recommendations
 */
@Entity('age_ranges')
export class AgeRange {
  /**
   * Unique identifier for the age range
   * Examples: 'A1', 'A2', 'A3'
   */
  @PrimaryColumn({ type: 'varchar', length: 50, name: 'ID' })
  ID: string;

  /**
   * Human-readable description of the age range
   * Examples: '0-6 months', '6-12 months', '1-2 years'
   */
  @Column({ type: 'varchar', length: 255, name: 'DESCRIPTION' })
  DESCRIPTION: string;
}
