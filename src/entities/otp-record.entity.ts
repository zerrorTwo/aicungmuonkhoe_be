import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

export enum OtpStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  EXPIRED = 'EXPIRED',
}

export enum OtpType {
  SIGN_UP = 'SIGN_UP',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  UPDATE_PHONE = 'UPDATE_PHONE',
  UPDATE_EMAIL = 'UPDATE_EMAIL',
}

@Entity('otp_records')
@Index('idx_phone_number', ['PHONE_NUMBER'])
@Index('idx_status', ['STATUS'])
export class OtpRecord {
  @PrimaryGeneratedColumn({ name: 'ID' })
  ID: number;

  // 🔹 Liên kết tới user
  @ManyToOne(() => User, (user) => user.OTP_RECORDS, {
    nullable: true,
    onDelete: 'CASCADE', // khi user bị xóa → OTP cũng bị xóa
  })
  @JoinColumn({ name: 'USER_ID_MNMN', referencedColumnName: 'USER_ID' })
  USER_ID_MNMN: number;

  @Column({ name: 'PHONE_NUMBER', length: 20 })
  PHONE_NUMBER: string;

  @Column({ name: 'OTP_CODE', length: 10 })
  OTP_CODE: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  CREATED_AT: Date;

  @Column({ name: 'EXPIRES_AT', type: 'timestamp' })
  EXPIRES_AT: Date;

  @Column({ name: 'SENT_COUNT', default: 0 })
  SENT_COUNT: number;

  @Column({
    name: 'STATUS',
    type: 'enum',
    enum: OtpStatus,
    default: OtpStatus.PENDING,
  })
  STATUS: OtpStatus;

  @Column({
    name: 'TYPE',
    type: 'enum',
    enum: OtpType,
    nullable: true,
  })
  TYPE: OtpType;
}
