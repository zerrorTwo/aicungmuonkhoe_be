import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HealthDocument } from './health-document.entity';
import { OtpRecord } from './otp-record.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'USER_ID' })
  USER_ID: number;

  @Column({ type: 'varchar', length: 255, name: 'PHONE', nullable: true })
  PHONE: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'EMAIL',
    nullable: false,
    unique: true,
  })
  EMAIL: string;

  @Column({ type: 'varchar', length: 255, name: 'PASSWORD', nullable: false })
  PASSWORD: string;

  @Column({ type: 'varchar', length: 255, name: 'START_TOUR', nullable: true })
  START_TOUR?: string;

  @Column({ type: 'tinyint', name: 'STATUS_ACTIVE', nullable: true })
  STATUS_ACTIVE: number;

  @Column({ type: 'tinyint', name: 'IS_ADMIN', nullable: true, default: 0 })
  IS_ADMIN: number;

  @Column({ type: 'tinyint', name: 'IS_DELETED', nullable: true, default: 0 })
  IS_DELETED: number;

  @Column({ type: 'longtext', name: 'FACE_IMAGE', nullable: true })
  FACE_IMAGE: string;

  @CreateDateColumn({ name: 'CREATED_AT', nullable: true })
  CREATED_AT?: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT', nullable: true })
  UPDATED_AT?: Date;

  // 1 user có nhiều health documents
  @OneToMany(() => HealthDocument, (healthDocument) => healthDocument.USER, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  HEALTH_DOCUMENTS: HealthDocument[];

  // 1 user có nhiều OTP records
  @OneToMany(() => OtpRecord, (otpRecord) => otpRecord.USER_ID_MNMN, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  OTP_RECORDS: OtpRecord[];
}
