import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('conclusion_recommend_management')
export class ConclusionRecommendManagement {
  @CreateDateColumn({ name: 'CREATED_DATE', nullable: true })
  CREATED_DATE: Date;

  @Column({ name: 'CREATED_BY', type: 'int', nullable: true })
  CREATED_BY: number;

  @UpdateDateColumn({ name: 'MODIFIED_DATE', nullable: true })
  MODIFIED_DATE: Date;

  @Column({ name: 'MODIFIED_BY', type: 'int', nullable: true })
  MODIFIED_BY: number;

  @Column({ name: 'IS_DELETED', type: 'tinyint', width: 1, default: 0 })
  IS_DELETED: boolean;

  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ name: 'MODEL', type: 'varchar', length: 255, nullable: true })
  MODEL: string;

  @Column({ name: 'AGE_TYPE', type: 'varchar', length: 255, nullable: true })
  AGE_TYPE: string;

  @Column({ name: 'TYPE', type: 'varchar', length: 255, nullable: true })
  TYPE: string;

  @Column({ name: 'GENDER', type: 'varchar', length: 255, nullable: true })
  GENDER: string;

  @Column({
    name: 'INDICATOR_FROM',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  INDICATOR_FROM: string;

  @Column({
    name: 'INDICATOR_TO',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  INDICATOR_TO: string;

  @Column({
    name: 'INDICATOR_AND',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  INDICATOR_AND: string;

  @Column({ name: 'VALUE_FROM', type: 'float', nullable: true })
  VALUE_FROM: number;

  @Column({ name: 'VALUE_TO', type: 'float', nullable: true })
  VALUE_TO: number;

  @Column({ name: 'VALUE_ONE_FROM', type: 'float', nullable: true })
  VALUE_ONE_FROM: number;

  @Column({ name: 'VALUE_ONE_TO', type: 'float', nullable: true })
  VALUE_ONE_TO: number;

  @Column({ name: 'CONCLUSION', type: 'varchar', length: 3000, nullable: true })
  CONCLUSION: string;

  @Column({ name: 'RECOMMEND', type: 'varchar', length: 3000, nullable: true })
  RECOMMEND: string;
}
