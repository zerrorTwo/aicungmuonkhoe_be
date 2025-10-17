import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { HealthDocument } from './health-document.entity';

@Entity('exercise_intensity')
export class ExerciseIntensity {
  @PrimaryGeneratedColumn({ name: 'ID' })
  ID: number;

  @Column({
    name: 'CODE',
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  CODE: string;

  @Column({
    name: 'DISPLAY_NAME',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  DISPLAY_NAME: string;

  // Quan hệ với bảng health_document
  @OneToMany(
    () => HealthDocument,
    (healthDocument) => healthDocument.EXERCISE_INTENSITY,
  )
  HEALTH_DOCUMENTS: HealthDocument[];
}
