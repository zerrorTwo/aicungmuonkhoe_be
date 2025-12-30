import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'material_groups' })
export class MaterialGroup {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'int' })
  ID: number;

  @Column({
    name: 'CODE',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  CODE: string;

  @Column({
    name: 'NAME',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  NAME?: string;

  @Column({
    name: 'DESCRIPTION',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  DESCRIPTION?: string;

  @CreateDateColumn({
    name: 'CREATED_DATE',
  })
  CREATED_DATE: Date;
}
