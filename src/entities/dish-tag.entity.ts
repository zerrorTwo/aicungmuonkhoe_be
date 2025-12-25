import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Dish } from './dish.entity';

@Entity('dish_tag')
export class DishTag {
  @PrimaryColumn({ type: 'varchar', length: 50, name: 'ID' })
  ID: string;

  @Column({ type: 'varchar', length: 50, name: 'DISH_ID', nullable: true })
  DISH_ID: string;

  @Column({ type: 'varchar', length: 512, name: 'TAG_NAME', nullable: true })
  TAG_NAME: string;

  @Column({ type: 'timestamp', name: 'CREATED_AT', nullable: true })
  CREATED_AT: Date;

  @Column({ type: 'timestamp', name: 'UPDATED_AT', nullable: true })
  UPDATED_AT: Date;

  // ===== RELATION (LOGICAL ONLY, NO FK DB) =====
  @ManyToOne(() => Dish, (dish) => dish.TAGS, { nullable: true })
  @JoinColumn({
    name: 'DISH_ID',
    referencedColumnName: 'ID',
  })
  DISH: Dish;
}
