import { Feature } from 'src/enums/user-start-tour.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_start_tour')
export class UserStartTour {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ type: 'boolean', default: false })
  IS_STARTED: boolean;

  @Column({ type: 'int' })
  USER_ID: number;

  @Column({
    type: 'enum',
    enum: Feature,
  })
  FEATURE: Feature;

  @CreateDateColumn()
  CREATED_AT: Date;

  @UpdateDateColumn()
  UPDATED_AT: Date;
}
