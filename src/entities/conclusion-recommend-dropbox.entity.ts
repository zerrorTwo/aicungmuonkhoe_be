import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('conclusion_recommend_dropbox')
export class ConclusionRecommendDropbox {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ name: 'NAME', type: 'varchar', length: 255, nullable: false })
  NAME: string;

  @Column({ name: 'CODE', type: 'varchar', length: 255, nullable: true })
  CODE: string;

  @Column({ name: 'MODEL', type: 'varchar', length: 255, nullable: true })
  MODEL: string;

  @Column({ name: 'TYPE', type: 'varchar', length: 255, nullable: true })
  TYPE: string;

  @Column({ name: 'INDEX', type: 'int', nullable: true })
  INDEX: number;

  @Column({ name: 'COLOR', type: 'varchar', length: 10, nullable: true })
  COLOR: string;
}
