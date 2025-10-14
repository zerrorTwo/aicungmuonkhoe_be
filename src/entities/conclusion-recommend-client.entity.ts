import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { HealthDocument } from './health-document.entity';

@Entity('conclusion_recommend_client')
export class ConclusionRecommendClient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'MODEL', type: 'varchar', length: 255, nullable: true })
  MODEL: string;

  @Column({ name: 'DATE', type: 'varchar', length: 255, nullable: true })
  DATE: string;

  @Column({ name: 'VALUE_SYS', type: 'float', nullable: true })
  VALUE_SYS: number;

  @Column({ name: 'VALUE_DIA', type: 'float', nullable: true })
  VALUE_DIA: number;

  @Column({ name: 'VALUE', type: 'float', nullable: true })
  VALUE: number;

  @Column({ name: 'VALUE_WEIGHT', type: 'float', nullable: true })
  VALUE_WEIGHT: number;

  @Column({ name: 'VALUE_HEIGHT', type: 'float', nullable: true })
  VALUE_HEIGHT: number;

  @Column({ name: 'INDICATOR', type: 'varchar', length: 255, nullable: true })
  INDICATOR: string;

  @Column({ name: 'TIME', type: 'varchar', length: 100, nullable: true })
  TIME: string;

  @Column({ name: 'HEALTH_DOCUMENT_ID', type: 'int', nullable: true })
  HEALTH_DOCUMENT_ID: number;

  @CreateDateColumn({ name: 'CREATED_DATE', nullable: true })
  CREATED_DATE: Date;

  @Column({ name: 'AGE_TYPE', type: 'varchar', length: 30, nullable: true })
  AGE_TYPE: string;

  @Column({ name: 'CREATED_BY', type: 'varchar', length: 10, nullable: true })
  CREATED_BY: string;

  // Liên kết với bảng HealthDocument
  @ManyToOne(() => HealthDocument, { nullable: true })
  @JoinColumn({ name: 'HEALTH_DOCUMENT_ID' })
  HEALTH_DOCUMENT: HealthDocument;
}
