import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('dish_age_range')
export class DishAgeRange {
  @PrimaryColumn({ type: 'varchar', length: 50, name: 'ID' })
  ID: string;

  @Column({ type: 'varchar', length: 255, name: 'NAME', nullable: true })
  NAME: string;

  @Column({ type: 'text', name: 'DESCRIPTION', nullable: true })
  DESCRIPTION: string;

  @Column({ type: 'int', name: 'POSITION', nullable: true })
  POSITION: number;

  @Column({ type: 'timestamp', name: 'CREATED_AT', nullable: true })
  CREATED_AT: Date;

  @Column({ type: 'timestamp', name: 'UPDATED_AT', nullable: true })
  UPDATED_AT: Date;
}
