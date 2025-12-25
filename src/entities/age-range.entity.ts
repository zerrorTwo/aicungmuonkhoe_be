import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Dish } from './dish.entity';

@Entity('age_ranges')
export class AgeRange {
  @PrimaryColumn({ type: 'varchar', length: 50, name: 'ID' })
  ID: string;

  @Column({ type: 'varchar', length: 255, name: 'DESCRIPTION' })
  DESCRIPTION: string;

  // ===== RELATION =====
  @OneToMany(() => Dish, (dish) => dish.AGE_RANGE)
  DISHES: Dish[];
}
