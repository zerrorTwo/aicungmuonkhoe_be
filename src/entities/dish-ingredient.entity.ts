import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Food } from './food.entity';

@Entity('dish_ingredient')
export class DishIngredient {
  @PrimaryColumn({ type: 'varchar', length: 50, name: 'ID' })
  ID: string;

  @PrimaryColumn({ type: 'int', name: 'INGREDIENT_ID' })
  INGREDIENT_ID: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'WEIGHT',
    nullable: true,
  })
  WEIGHT: number;

  @Column({ type: 'text', name: 'PROCESSING_METHOD', nullable: true })
  PROCESSING_METHOD: string;

  @Column({ type: 'timestamp', name: 'CREATED_AT', nullable: true })
  CREATED_AT: Date;

  @Column({ type: 'timestamp', name: 'UPDATED_AT', nullable: true })
  UPDATED_AT: Date;

  @ManyToOne(() => Food, (food) => food.DISH_INGREDIENTS, { nullable: true })
  @JoinColumn({
    name: 'INGREDIENT_ID',
    referencedColumnName: 'ID',
  })
  FOOD: Food;
}
