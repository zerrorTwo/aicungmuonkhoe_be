import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Gender } from './gender.entity';
import { ExerciseIntensity } from './exercise-intensity.entity';
import { Province } from './province.entity';

@Entity('health_document')
export class HealthDocument {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ name: 'IS_DELETED', type: 'tinyint', width: 1, default: 0 })
  IS_DELETED: boolean;

  // Quan hệ với bảng users
  @ManyToOne(() => User, (user) => user.HEALTH_DOCUMENTS, {
    nullable: true,
    onDelete: 'CASCADE', // Khi xóa user sẽ xóa luôn health document này
  })
  @JoinColumn({ name: 'USER_ID' })
  USER: User;

  @Column({ type: 'varchar', length: 255, name: 'FULL_NAME' })
  FULL_NAME: string;

  @Column({ name: 'DOB', type: 'varchar', length: 255, nullable: true })
  DOB: string;

  @Column({ name: 'PHONE', type: 'varchar', length: 255, nullable: true })
  PHONE: string;

  @Column({ name: 'IS_LINK', type: 'tinyint', width: 1, default: 0 })
  IS_LINK: boolean;

  @Column({ name: 'IS_SYNC', type: 'tinyint', width: 1, default: 0 })
  IS_SYNC: boolean;

  @Column({ name: 'TYPE', type: 'varchar', length: 255, nullable: true })
  TYPE: string;

  @Column({ name: 'HEIGHT', type: 'varchar', length: 100, nullable: true })
  HEIGHT: string;

  @Column({ name: 'WEIGHT', type: 'varchar', length: 100, nullable: true })
  WEIGHT: string;

  @Column({
    name: 'HEALTH_STATUS',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  HEALTH_STATUS: string;

  @Column({ name: 'JOB', type: 'varchar', length: 100, nullable: true })
  JOB: string;

  @Column({
    name: 'DATE_WORKDAY',
    type: 'int',
    nullable: true,
    default: 0,
  })
  DATE_WORKDAY: number;

  @Column({ name: 'DATE_OFF', type: 'int', nullable: true, default: 0 })
  DATE_OFF: number;

  @Column({ name: 'IS_MYSELF', type: 'tinyint', width: 1, default: 0 })
  IS_MYSELF: boolean;

  @Column({ name: 'IS_UPDATE', type: 'tinyint', width: 1, default: 0 })
  IS_UPDATE: boolean;

  @Column({ name: 'AVATAR', type: 'varchar', length: 255, nullable: true })
  AVATAR: string;

  @Column({
    name: 'EXERCISE_FREQUENCY',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  EXERCISE_FREQUENCY: string;

  @ManyToOne(() => Gender, (gender: Gender) => gender.HEALTH_DOCUMENTS, {
    nullable: true,
  })
  @JoinColumn({ name: 'GENDER_ID' })
  GENDER: Gender;

  @ManyToOne(
    () => ExerciseIntensity,
    (exerciseIntensity: ExerciseIntensity) =>
      exerciseIntensity.HEALTH_DOCUMENTS,
    { nullable: true, onDelete: 'SET NULL' },
  )
  @JoinColumn({ name: 'EXERCISE_INTENSITY_ID' })
  EXERCISE_INTENSITY: ExerciseIntensity;

  // Quan hệ với bảng provinces
  @ManyToOne(() => Province, (province: Province) => province.HealthDocuments, {
    nullable: true,
  })
  @JoinColumn({ name: 'PROVINCE_ID' })
  PROVINCE: Province;
}
