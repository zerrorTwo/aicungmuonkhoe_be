import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

/**
 * HealthStatus Entity
 *
 * Represents various health conditions/statuses used for dietary recommendations
 * Maps to the 'hm_health_status' table in the database
 *
 * Business Logic:
 * - Each health status has unique identifier (HEALTH_STATUS_ID)
 * - Used to determine specific nutritional needs and food recommendations
 * - Examples: diabetes, hypertension, pregnancy, lactation, normal health
 * - Critical for personalized nutrition planning and food recommendations
 */
@Entity('hm_health_status')
export class HealthStatus {
  /**
   * Auto-incrementing primary key
   */
  @PrimaryGeneratedColumn({ name: 'ID' })
  ID: number;

  /**
   * Unique health status identifier code
   * Examples: 'HS001' (diabetes), 'HS002' (hypertension), etc.
   */
  @Column({
    type: 'varchar',
    length: 50,
    name: 'HEALTH_STATUS_ID',
    unique: true,
  })
  HEALTH_STATUS_ID: string;

  /**
   * Display name for the health status
   * Shown to users in the application
   */
  @Column({ type: 'varchar', length: 255, name: 'DISPLAY_NAME' })
  @Index('idx_health_status_display_name')
  DISPLAY_NAME: string;

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
   * User ID who created this record
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
   * User ID who last updated this record
   */
  @Column({ type: 'int', name: 'UPDATED_BY', nullable: true })
  UPDATED_BY: number;
}
