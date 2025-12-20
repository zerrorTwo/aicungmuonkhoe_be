import {
  Entity,
  PrimaryColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

/**
 * Food Entity
 *
 * Represents individual food items with complete nutritional information
 * Maps to the 'foods' table in the database
 *
 * Business Logic:
 * - Contains comprehensive nutritional data per 100g of food
 * - Used for meal planning, nutritional calculations, and food recommendations
 * - Includes macronutrients (protein, fat, carbs) and micronutrients (vitamins, minerals)
 * - Classification helps in food grouping and recommendation logic
 * - Standard volume helps with portion size recommendations
 */
@Entity('foods')
export class Food {
  /**
   * Unique food identifier
   */
  @PrimaryColumn({ type: 'int', name: 'ID' })
  ID: number;

  /**
   * Food name in Vietnamese
   */
  @Column({ type: 'varchar', length: 255, name: 'NAME', nullable: true })
  NAME: string;

  /**
   * Material/ingredient group classification
   */
  @Column({
    type: 'varchar',
    length: 255,
    name: 'GROUP_MATERIAL',
    nullable: true,
  })
  GROUP_MATERIAL: string;

  /**
   * Nutritional group classification
   */
  @Column({
    type: 'varchar',
    length: 255,
    name: 'GROUP_NUTRITION',
    nullable: true,
  })
  GROUP_NUTRITION: string;

  /**
   * Food category group
   */
  @Column({ type: 'varchar', length: 255, name: 'GROUP_FOOD', nullable: true })
  GROUP_FOOD: string;

  /**
   * Protein classification level
   */
  @Column({
    type: 'varchar',
    length: 255,
    name: 'PROTEIN_CLASSIFICATION',
    nullable: true,
  })
  PROTEIN_CLASSIFICATION: string;

  /**
   * Sugar/carbohydrate classification level
   */
  @Column({
    type: 'varchar',
    length: 255,
    name: 'SUGAR_CLASSIFICATION',
    nullable: true,
  })
  SUGAR_CLASSIFICATION: string;

  /**
   * Fruit classification (if applicable)
   */
  @Column({
    type: 'varchar',
    length: 255,
    name: 'FRUIT_CLASSIFICATION',
    nullable: true,
  })
  FRUIT_CLASSIFICATION: string;

  /**
   * Snack food classification
   */
  @Column({ type: 'varchar', length: 255, name: 'FOOD_SNACK', nullable: true })
  FOOD_SNACK: string;

  /**
   * Standard serving volume/portion
   */
  @Column({
    type: 'varchar',
    length: 255,
    name: 'STANDARD_VOLUME',
    nullable: true,
  })
  STANDARD_VOLUME: string;

  // ===== MACRONUTRIENTS (per 100g) =====

  /**
   * Energy content in kcal per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'ENERGY',
    nullable: true,
  })
  ENERGY: number;

  /**
   * Water content in grams per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'WATER',
    nullable: true,
  })
  WATER: number;

  /**
   * Total protein in grams per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'PROTEIN',
    nullable: true,
  })
  PROTEIN: number;

  /**
   * Animal-based protein in grams per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'ANIMAL_PROTEIN',
    nullable: true,
  })
  ANIMAL_PROTEIN: number;

  /**
   * Plant-based protein in grams per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'VEGETABLE_PROTEIN',
    nullable: true,
  })
  VEGETABLE_PROTEIN: number;

  /**
   * Total fat in grams per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'FAT',
    nullable: true,
  })
  FAT: number;

  /**
   * Animal-based fat in grams per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'ANIMAL_FAT',
    nullable: true,
  })
  ANIMAL_FAT: number;

  /**
   * Plant-based fat in grams per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'VEGETABLE_FAT',
    nullable: true,
  })
  VEGETABLE_FAT: number;

  /**
   * Monounsaturated fat in grams per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'MONO_UNSATURATED_FAT',
    nullable: true,
  })
  MONO_UNSATURATED_FAT: number;

  /**
   * Polyunsaturated fat in grams per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'POLY_UNSATURATED_FAT',
    nullable: true,
  })
  POLY_UNSATURATED_FAT: number;

  /**
   * Total unsaturated fat in grams per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'TOTAL_UNSATURATED_FAT',
    nullable: true,
  })
  TOTAL_UNSATURATED_FAT: number;

  /**
   * Cholesterol in mg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'CHOLESTEROL',
    nullable: true,
  })
  CHOLESTEROL: number;

  /**
   * Starch and sugar combined in grams per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'STARCH_SUGAR',
    nullable: true,
  })
  STARCH_SUGAR: number;

  /**
   * Sugar content in grams per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'SUGAR',
    nullable: true,
  })
  SUGAR: number;

  /**
   * Dietary fiber in grams per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'FIBER',
    nullable: true,
  })
  FIBER: number;

  // ===== MINERALS (per 100g) =====

  /**
   * Calcium (Canxi) in mg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'CANXI',
    nullable: true,
  })
  CANXI: number;

  /**
   * Iron in mg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'IRON',
    nullable: true,
  })
  IRON: number;

  /**
   * Zinc in mg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'ZINC',
    nullable: true,
  })
  ZINC: number;

  /**
   * Potassium (Kali) in mg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'KALI',
    nullable: true,
  })
  KALI: number;

  /**
   * Sodium (Natri) in mg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'NATRI',
    nullable: true,
  })
  NATRI: number;

  /**
   * Chlorine (Clo) in mg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'CLO',
    nullable: true,
  })
  CLO: number;

  /**
   * Phosphorus (Phospho) in mg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'PHOSPHO',
    nullable: true,
  })
  PHOSPHO: number;

  /**
   * Magnesium (Magie) in mg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'MAGIE',
    nullable: true,
  })
  MAGIE: number;

  /**
   * Iodine in mcg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'IOD',
    nullable: true,
  })
  IOD: number;

  /**
   * Selenium in mcg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'SELEN',
    nullable: true,
  })
  SELEN: number;

  /**
   * Copper in mg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'COPPER',
    nullable: true,
  })
  COPPER: number;

  /**
   * Chromium (Crom) in mcg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'CROM',
    nullable: true,
  })
  CROM: number;

  /**
   * Manganese (Mangan) in mg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'MANGAN',
    nullable: true,
  })
  MANGAN: number;

  /**
   * Fluorine (Fluo) in mg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'FLUO',
    nullable: true,
  })
  FLUO: number;

  /**
   * Salt content in grams per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'SALT',
    nullable: true,
  })
  SALT: number;

  // ===== VITAMINS (per 100g) =====

  /**
   * Vitamin A in mcg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'VITAMIN_A',
    nullable: true,
  })
  VITAMIN_A: number;

  /**
   * Vitamin D in mcg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'VITAMIN_D',
    nullable: true,
  })
  VITAMIN_D: number;

  /**
   * Vitamin E in mg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'VITAMIN_E',
    nullable: true,
  })
  VITAMIN_E: number;

  /**
   * Vitamin K in mcg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'VITAMIN_K',
    nullable: true,
  })
  VITAMIN_K: number;

  /**
   * Vitamin B1 (Thiamine) in mg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'VITAMIN_B1',
    nullable: true,
  })
  VITAMIN_B1: number;

  /**
   * Vitamin B2 (Riboflavin) in mg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'VITAMIN_B2',
    nullable: true,
  })
  VITAMIN_B2: number;

  /**
   * Vitamin B3 (Niacin) in mg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'VITAMIN_B3',
    nullable: true,
  })
  VITAMIN_B3: number;

  /**
   * Vitamin B5 (Pantothenic Acid) in mg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'VITAMIN_B5',
    nullable: true,
  })
  VITAMIN_B5: number;

  /**
   * Vitamin B6 (Pyridoxine) in mg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'VITAMIN_B6',
    nullable: true,
  })
  VITAMIN_B6: number;

  /**
   * Vitamin B9 (Folate) in mcg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'VITAMIN_B9',
    nullable: true,
  })
  VITAMIN_B9: number;

  /**
   * Vitamin B12 (Cobalamin) in mcg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'VITAMIN_B12',
    nullable: true,
  })
  VITAMIN_B12: number;

  /**
   * Vitamin C (Ascorbic Acid) in mg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'VITAMIN_C',
    nullable: true,
  })
  VITAMIN_C: number;

  /**
   * Folate in mcg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'FOLATE',
    nullable: true,
  })
  FOLATE: number;

  /**
   * Folic Acid in mcg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'AXIT_FOLIC',
    nullable: true,
  })
  AXIT_FOLIC: number;

  /**
   * Biotin in mcg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'BIOTIN',
    nullable: true,
  })
  BIOTIN: number;

  /**
   * Choline in mg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'CHOLINE',
    nullable: true,
  })
  CHOLINE: number;

  // ===== CAROTENOIDS =====

  /**
   * Retinol in mcg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'RETINOL',
    nullable: true,
  })
  RETINOL: number;

  /**
   * Alpha-Carotene in mcg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'A_CAROTINE',
    nullable: true,
  })
  A_CAROTINE: number;

  /**
   * Beta-Carotene in mcg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'B_CAROTINE',
    nullable: true,
  })
  B_CAROTINE: number;

  /**
   * Beta-Cryptoxanthin in mcg per 100g
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'B_CRYPTOXANTHIN',
    nullable: true,
  })
  B_CRYPTOXANTHIN: number;

  // ===== METADATA =====

  /**
   * Image URL for raw/uncooked food
   */
  @Column({ type: 'varchar', length: 255, name: 'IMAGE', nullable: true })
  IMAGE: string;

  /**
   * Image URL for cooked food
   */
  @Column({
    type: 'varchar',
    length: 255,
    name: 'IMAGE_COOKED',
    nullable: true,
  })
  IMAGE_COOKED: string;

  /**
   * Weight of inedible parts (peel, bones, etc.) in grams
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'REMOVE_FOOD_WEIGHT',
    nullable: true,
  })
  REMOVE_FOOD_WEIGHT: number;

  /**
   * Record creation timestamp
   */
  @CreateDateColumn({
    type: 'datetime',
    name: 'CREATED_DATE',
  })
  CREATED_DATE: Date;

  /**
   * Last modification timestamp
   */
  @UpdateDateColumn({
    type: 'datetime',
    name: 'MODIFIED_DATE',
    nullable: true, // ⭐ quan trọng
  })
  MODIFIED_DATE: Date;

  /**
   * User ID who created this record
   */
  @Column({ type: 'int', name: 'CREATED_BY', nullable: true })
  CREATED_BY: number;

  /**
   * User ID who last updated this record
   */
  @Column({ type: 'int', name: 'UPDATED_BY', nullable: true })
  UPDATED_BY: number;
}
