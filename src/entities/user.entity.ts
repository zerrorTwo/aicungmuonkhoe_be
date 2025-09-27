import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  user_id: number;

  @Column({ type: 'varchar', length: 255, name: 'first_name' })
  first_name: string;

  @Column({ type: 'varchar', length: 255, name: 'last_name', nullable: true })
  last_name: string;

  @Column({ type: 'varchar', length: 255, name: 'phone', nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, name: 'email', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, name: 'password', nullable: false })
  password: string;

  @Column({ type: 'date', name: 'dob', nullable: true })
  dob: Date;

  @Column({ type: 'varchar', length: 255, name: 'province', nullable: true })
  province: string;

  @Column({ type: 'varchar', length: 255, name: 'start_tour', nullable: true })
  start_tour?: string;

  @Column({ type: 'varchar', length: 50, name: 'gender', nullable: true })
  gender: string;

  @Column({ type: 'tinyint', name: 'status_active', nullable: true })
  status_active: number;

  @Column({ type: 'tinyint', name: 'is_admin', nullable: true, default: 0 })
  is_admin: number;

  @Column({ type: 'tinyint', name: 'is_deleted', nullable: true, default: 0 })
  is_deleted: number;

  @Column({ type: 'longtext', name: 'face_image', nullable: true })
  face_image: string;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updated_at?: Date;
}
