import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tips')
export class Tips {
  @PrimaryColumn({ type: 'varchar', length: 255, name: 'TIP', nullable: false })
  TIP: string;
}
