import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HealthDocument } from './health-document.entity';

@Entity('provinces')
export class Province {
  @PrimaryGeneratedColumn({ name: 'PROVINCE_ID' })
  PROVINCE_ID: number;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'NAME',
    nullable: false,
    unique: true,
  })
  NAME: string;

  @Column({
    type: 'varchar',
    length: 10,
    name: 'CODE',
    nullable: false,
    unique: true,
  })
  CODE: string;

  @CreateDateColumn({ name: 'CREATED_AT', nullable: true })
  CREATED_AT?: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT', nullable: true })
  UPDATED_AT?: Date;

  @OneToMany(
    () => HealthDocument,
    (healthDocument: HealthDocument) => healthDocument.PROVINCE,
  )
  HealthDocuments: HealthDocument[];

  @Column({ type: 'varchar', length: 50, name: 'TYPE', nullable: false })
  TYPE: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'NAME_WITH_TYPE',
    nullable: false,
  })
  NAME_WITH_TYPE: string;
}
