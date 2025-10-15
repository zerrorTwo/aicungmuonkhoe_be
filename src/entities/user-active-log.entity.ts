import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users_active_log')
export class UsersActiveLog {
  @PrimaryGeneratedColumn()
  ID: number;

  @CreateDateColumn({ name: 'CREATED_DATE', type: 'datetime', nullable: true })
  CREATED_DATE: Date;

  @Column({
    name: 'USER_ID',
    type: 'int',
    nullable: true,
  })
  USER_ID: number;

  @Column({ name: 'FULL_NAME', type: 'varchar', length: 255, nullable: true })
  FULL_NAME: string;

  @Column({ name: 'ACTION', type: 'varchar', length: 255, nullable: true })
  ACTION: string;

  @Column({ name: 'DEVICE', type: 'varchar', length: 255, nullable: true })
  DEVICE: string;
}
