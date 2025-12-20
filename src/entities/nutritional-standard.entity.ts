import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AgeRange } from './age-range.entity';
import { HealthStatus } from './health-status.entity';
import { Gender } from './gender.entity';
import { ExerciseIntensity } from './exercise-intensity.entity';

/**
 * NutritionalStandard Entity
 *
 * Represents daily nutritional requirements based on multiple factors
 * Maps to the 'nutritional_standards' table in the database
 *
 * Business Logic:
 * - Calculates personalized nutrition standards based on:
 *   • Age range (infant, child, adult, elderly)
 *   • Health status (normal, diabetes, hypertension, pregnancy, etc.)
 *   • Gender (male/female)
 *   • Weight range
 *   • Physical activity level
 *   • Nutritional status indicators (BMI, Z-score)
 *
 * - Energy standards vary by:
 *   • Meal structure: 3 meals (3_BS, 3_BTR, 3_BT) or 4 meals (4_BS, 4_BTR, 4_BT, 4_BP)
 *   • Each meal has min and max energy ranges in kcal
 *
 * - Labor factor adjusts requirements based on activity level
 * - Used as foundation for all dietary recommendations and meal planning
 */
@Entity('nutritional_standards')
@Index(
  'uq_nutritional_standards_unique',
  [
    'AGE_RANGE_ID',
    'HEALTH_STATUS_ID',
    'GENDER_ID',
    'WEIGHT_MIN',
    'WEIGHT_MAX',
    'NUTRITION_STATUS_ZSCORE',
    'NUTRITION_STATUS_BMI_CHILD',
    'NUTRITION_STATUS_BMI_ADULT',
    'PHYSICAL_ACTIVITY_ID',
  ],
  { unique: true },
)
export class NutritionalStandard {
  /**
   * Auto-incrementing primary key
   */
  @PrimaryGeneratedColumn({ name: 'ID' })
  ID: number;

  /**
   * Age range identifier
   * Links to age_ranges table
   */
  @Column({ type: 'varchar', length: 5, name: 'AGE_RANGE_ID' })
  AGE_RANGE_ID: string;

  @ManyToOne(() => AgeRange, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'AGE_RANGE_ID' })
  AGE_RANGE: AgeRange;

  /**
   * Health status identifier
   * Links to hm_health_status table
   */
  @Column({ type: 'varchar', length: 10, name: 'HEALTH_STATUS_ID' })
  HEALTH_STATUS_ID: string;

  @ManyToOne(() => HealthStatus, { createForeignKeyConstraints: false })
  @JoinColumn({
    name: 'HEALTH_STATUS_ID',
    referencedColumnName: 'HEALTH_STATUS_ID',
  })
  HEALTH_STATUS: HealthStatus;

  /**
   * Gender identifier (1=male, 2=female)
   * Links to genders table
   */
  @Column({ type: 'int', name: 'GENDER_ID' })
  GENDER_ID: number;

  @ManyToOne(() => Gender, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'GENDER_ID' })
  GENDER: Gender;

  /**
   * Minimum weight for this standard (in kg)
   */
  @Column({ type: 'float', name: 'WEIGHT_MIN' })
  WEIGHT_MIN: number;

  /**
   * Maximum weight for this standard (in kg)
   */
  @Column({ type: 'float', name: 'WEIGHT_MAX' })
  WEIGHT_MAX: number;

  /**
   * Z-score nutritional status classification
   * Used for children's nutritional assessment
   */
  @Column({
    type: 'varchar',
    length: 5,
    name: 'NUTRITION_STATUS_ZSCORE',
    nullable: true,
  })
  NUTRITION_STATUS_ZSCORE: string;

  /**
   * BMI classification for children
   */
  @Column({
    type: 'varchar',
    length: 5,
    name: 'NUTRITION_STATUS_BMI_CHILD',
    nullable: true,
  })
  NUTRITION_STATUS_BMI_CHILD: string;

  /**
   * BMI classification for adults
   */
  @Column({
    type: 'varchar',
    length: 5,
    name: 'NUTRITION_STATUS_BMI_ADULT',
    nullable: true,
  })
  NUTRITION_STATUS_BMI_ADULT: string;

  /**
   * Physical activity level ID
   * Links to exercise_intensity table
   */
  @Column({ type: 'int', name: 'PHYSICAL_ACTIVITY_ID' })
  PHYSICAL_ACTIVITY_ID: number;

  @ManyToOne(() => ExerciseIntensity, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'PHYSICAL_ACTIVITY_ID' })
  PHYSICAL_ACTIVITY: ExerciseIntensity;

  /**
   * Labor factor multiplier
   * Adjusts energy requirements based on activity level
   * Typically ranges from 1.2 (sedentary) to 2.0+ (very active)
   */
  @Column({ type: 'float', name: 'LABOR_FACTOR' })
  LABOR_FACTOR: number;

  // ===== 3-MEAL STRUCTURE ENERGY STANDARDS (kcal) =====

  /**
   * Minimum energy for breakfast in 3-meal structure (kcal)
   * BS = Bữa Sáng (Breakfast)
   */
  @Column({ type: 'float', name: 'ENERGY_STANDARD_3_BS_MIN', default: 0 })
  ENERGY_STANDARD_3_BS_MIN: number;

  /**
   * Maximum energy for breakfast in 3-meal structure (kcal)
   */
  @Column({ type: 'float', name: 'ENERGY_STANDARD_3_BS_MAX', default: 0 })
  ENERGY_STANDARD_3_BS_MAX: number;

  /**
   * Minimum energy for lunch in 3-meal structure (kcal)
   * BTR = Bữa Trưa (Lunch)
   */
  @Column({ type: 'float', name: 'ENERGY_STANDARD_3_BTR_MIN', default: 0 })
  ENERGY_STANDARD_3_BTR_MIN: number;

  /**
   * Maximum energy for lunch in 3-meal structure (kcal)
   */
  @Column({ type: 'float', name: 'ENERGY_STANDARD_3_BTR_MAX', default: 0 })
  ENERGY_STANDARD_3_BTR_MAX: number;

  /**
   * Minimum energy for dinner in 3-meal structure (kcal)
   * BT = Bữa Tối (Dinner)
   */
  @Column({ type: 'float', name: 'ENERGY_STANDARD_3_BT_MIN', default: 0 })
  ENERGY_STANDARD_3_BT_MIN: number;

  /**
   * Maximum energy for dinner in 3-meal structure (kcal)
   */
  @Column({ type: 'float', name: 'ENERGY_STANDARD_3_BT_MAX', default: 0 })
  ENERGY_STANDARD_3_BT_MAX: number;

  // ===== 4-MEAL STRUCTURE ENERGY STANDARDS (kcal) =====

  /**
   * Minimum energy for breakfast in 4-meal structure (kcal)
   */
  @Column({ type: 'float', name: 'ENERGY_STANDARD_4_BS_MIN', default: 0 })
  ENERGY_STANDARD_4_BS_MIN: number;

  /**
   * Maximum energy for breakfast in 4-meal structure (kcal)
   */
  @Column({ type: 'float', name: 'ENERGY_STANDARD_4_BS_MAX', default: 0 })
  ENERGY_STANDARD_4_BS_MAX: number;

  /**
   * Minimum energy for lunch in 4-meal structure (kcal)
   */
  @Column({ type: 'float', name: 'ENERGY_STANDARD_4_BTR_MIN', default: 0 })
  ENERGY_STANDARD_4_BTR_MIN: number;

  /**
   * Maximum energy for lunch in 4-meal structure (kcal)
   */
  @Column({ type: 'float', name: 'ENERGY_STANDARD_4_BTR_MAX', default: 0 })
  ENERGY_STANDARD_4_BTR_MAX: number;

  /**
   * Minimum energy for dinner in 4-meal structure (kcal)
   */
  @Column({ type: 'float', name: 'ENERGY_STANDARD_4_BT_MIN', default: 0 })
  ENERGY_STANDARD_4_BT_MIN: number;

  /**
   * Maximum energy for dinner in 4-meal structure (kcal)
   */
  @Column({ type: 'float', name: 'ENERGY_STANDARD_4_BT_MAX', default: 0 })
  ENERGY_STANDARD_4_BT_MAX: number;

  /**
   * Minimum energy for snack in 4-meal structure (kcal)
   * BP = Bữa Phụ (Snack)
   */
  @Column({ type: 'float', name: 'ENERGY_STANDARD_4_BP_MIN', default: 0 })
  ENERGY_STANDARD_4_BP_MIN: number;

  /**
   * Maximum energy for snack in 4-meal structure (kcal)
   */
  @Column({ type: 'float', name: 'ENERGY_STANDARD_4_BP_MAX', default: 0 })
  ENERGY_STANDARD_4_BP_MAX: number;

  // ===== METADATA =====

  /**
   * Record creation timestamp
   */
  @Column({
    type: 'datetime',
    name: 'CREATED_AT',
    default: () => 'CURRENT_TIMESTAMP',
  })
  CREATED_AT: Date;

  /**
   * Last update timestamp
   */
  @Column({
    type: 'datetime',
    name: 'UPDATED_AT',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  UPDATED_AT: Date;
}
