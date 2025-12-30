import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DishTag } from './dish-tag.entity';
import { AgeRange } from './age-range.entity';

@Entity('dish')
export class Dish {
  @PrimaryColumn({ type: 'varchar', length: 50, name: 'ID' })
  ID: string;

  @PrimaryColumn({ type: 'varchar', length: 50, name: 'AGE_GROUP_ID' })
  AGE_GROUP_ID: string;

  @Column({ type: 'varchar', length: 255, name: 'NAME', nullable: true })
  NAME: string;

  @Column({ type: 'varchar', length: 50, name: 'REGION_ID', nullable: true })
  REGION_ID: string;

  @Column({
    type: 'varchar',
    length: 512,
    name: 'COOKING_METHOD_ID',
    nullable: true,
  })
  COOKING_METHOD_ID: string;

  @Column({
    type: 'varchar',
    length: 512,
    name: 'MEAL_STRUCTURE_ID',
    nullable: true,
  })
  MEAL_STRUCTURE_ID: string;

  @Column({ type: 'varchar', length: 255, name: 'SMALL_IMAGE', nullable: true })
  SMALL_IMAGE: string;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'EXTERNAL_DISH_TYPE_ID',
    nullable: true,
  })
  EXTERNAL_DISH_TYPE_ID: string;

  @Column({ type: 'varchar', length: 255, name: 'LARGE_IMAGE', nullable: true })
  LARGE_IMAGE: string;

  @Column({ type: 'text', name: 'COOKING_INSTRUCTION', nullable: true })
  COOKING_INSTRUCTION: string;

  @Column({ type: 'text', name: 'TIPS', nullable: true })
  TIPS: string;

  @Column({ type: 'text', name: 'ADDITIONAL_INFO', nullable: true })
  ADDITIONAL_INFO: string;

  @Column({ type: 'tinyint', name: 'STATUS', nullable: true })
  STATUS: number;

  // ===== AUDIT =====
  @Column({ type: 'varchar', length: 50, name: 'CREATED_BY', nullable: true })
  CREATED_BY: string;

  @Column({ type: 'timestamp', name: 'CREATED_AT', nullable: true })
  CREATED_AT: Date;

  @Column({ type: 'varchar', length: 50, name: 'UPDATED_BY', nullable: true })
  UPDATED_BY: string;

  @Column({ type: 'timestamp', name: 'UPDATED_AT', nullable: true })
  UPDATED_AT: Date;

  // ===== RELATION =====

  // Dish -> AgeRange
  @ManyToOne(() => AgeRange, (ageRange) => ageRange.DISHES)
  @JoinColumn({ name: 'AGE_GROUP_ID', referencedColumnName: 'ID' })
  AGE_RANGE: AgeRange;

  // Dish -> DishTag
  @OneToMany(() => DishTag, (tag) => tag.DISH)
  TAGS: DishTag[];
}
