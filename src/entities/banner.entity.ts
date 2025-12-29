import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'banners' })
export class BannerEntity {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  IMAGE: string;

  @Column({ type: 'varchar', length: 255 })
  TITLE: string;

  @Column({ type: 'boolean', default: true })
  ACTIVE: boolean;

  @Column({ type: 'int', nullable: true })
  CREATED_BY: number;

  @Column({ type: 'int', nullable: true })
  UPDATED_BY: number;

  @CreateDateColumn({ name: 'CREATED_AT' })
  CREATED_AT: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  UPDATED_AT: Date;
}
