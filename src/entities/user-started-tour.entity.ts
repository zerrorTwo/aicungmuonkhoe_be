import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Feature } from 'src/enums/user-start-tour.enum';

@Entity('user_started_tour')
export class UserStartedTour {
  @PrimaryGeneratedColumn({ name: 'ID' })
  ID: number;

  @Column({ type: 'int', name: 'USER_ID', nullable: false })
  USER_ID: number;

  @Column({ type: 'varchar', length: 100, name: 'FEATURE', nullable: false })
  FEATURE: Feature;

  @Column({
    type: 'tinyint',
    name: 'IS_COMPLETED',
    nullable: false,
    default: 1,
  })
  IS_COMPLETED: number;

  @CreateDateColumn({ name: 'CREATED_AT', nullable: true })
  CREATED_AT?: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT', nullable: true })
  UPDATED_AT?: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'USER_ID' })
  USER: User;
}
