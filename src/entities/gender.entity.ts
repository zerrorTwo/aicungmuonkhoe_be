import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { HealthDocument } from './health-document.entity';

@Entity('genders')
export class Gender {
    @PrimaryGeneratedColumn()
    ID: number;

    @CreateDateColumn({ name: 'CREATED_DATE', type: 'datetime', nullable: true })
    CREATED_DATE: Date;

    @Column({ name: 'CREATED_BY', type: 'int', nullable: true })
    CREATED_BY: number;

    @UpdateDateColumn({ name: 'MODIFIED_DATE', type: 'datetime', nullable: true })
    MODIFIED_DATE: Date;

    @Column({ name: 'MODIFIED_BY', type: 'int', nullable: true })
    MODIFIED_BY: number;

    @Column({ name: 'IS_DELETED', type: 'tinyint', width: 1, default: 0 })
    IS_DELETED: boolean;

    @Column({ name: 'NAME', type: 'varchar', length: 255, nullable: false })
    NAME: string;

    @Column({ name: 'CD', type: 'varchar', length: 255, nullable: true })
    CD: string;

    @Column({ name: 'DESC', type: 'varchar', length: 255, nullable: true })
    DESC: string;

    // Quan hệ với bảng health_document
    @OneToMany(() => HealthDocument, (healthDocument) => healthDocument.GENDER)
    HEALTH_DOCUMENTS: HealthDocument[];
}