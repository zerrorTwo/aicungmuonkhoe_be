import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { DishIngredient } from './dish-ingredient.entity';

@Entity('foods')
export class Food {
  @PrimaryColumn({ type: 'int', name: 'ID' })
  ID: number;

  @Column({ type: 'varchar', length: 255, name: 'NAME', nullable: true })
  NAME: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'GROUP_MATERIAL',
    nullable: true,
  })
  GROUP_MATERIAL: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'ENERGY',
    nullable: true,
  })
  ENERGY: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'WATER',
    nullable: true,
  })
  WATER: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'PROTEIN',
    nullable: true,
  })
  PROTEIN: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'ANIMAL_PROTEIN',
    nullable: true,
  })
  ANIMAL_PROTEIN: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'VEGETABLE_PROTEIN',
    nullable: true,
  })
  VEGETABLE_PROTEIN: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'FAT',
    nullable: true,
  })
  FAT: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'ANIMAL_FAT',
    nullable: true,
  })
  ANIMAL_FAT: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'VEGETABLE_FAT',
    nullable: true,
  })
  VEGETABLE_FAT: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'MONO_UNSATURATED_FAT',
    nullable: true,
  })
  MONO_UNSATURATED_FAT: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'POLY_UNSATURATED_FAT',
    nullable: true,
  })
  POLY_UNSATURATED_FAT: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'TOTAL_UNSATURATED_FAT',
    nullable: true,
  })
  TOTAL_UNSATURATED_FAT: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'CHOLESTEROL',
    nullable: true,
  })
  CHOLESTEROL: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'STARCH_SUGAR',
    nullable: true,
  })
  STARCH_SUGAR: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'SUGAR',
    nullable: true,
  })
  SUGAR: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'FIBER',
    nullable: true,
  })
  FIBER: number;

  @Column({ type: 'varchar', length: 255, name: 'IMAGE', nullable: true })
  IMAGE: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'IMAGE_COOKED',
    nullable: true,
  })
  IMAGE_COOKED: string;

  @Column({ type: 'datetime', name: 'CREATED_DATE', nullable: true })
  CREATED_DATE: Date;

  @Column({ type: 'datetime', name: 'MODIFIED_DATE', nullable: true })
  MODIFIED_DATE: Date;

  @Column({ type: 'int', name: 'CREATED_BY', nullable: true })
  CREATED_BY: number;

  @Column({ type: 'int', name: 'UPDATED_BY', nullable: true })
  UPDATED_BY: number;

  @OneToMany(() => DishIngredient, (di) => di.FOOD)
  DISH_INGREDIENTS: DishIngredient[];
}
