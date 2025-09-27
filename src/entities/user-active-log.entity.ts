import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity('users_active_log')
export class UsersActiveLog {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ name: 'CREATED_DATE', type: 'datetime', nullable: true })
    createdDate: Date;

    @Column({ name: 'USER_ID_MNMN', type: 'varchar', length: 255, nullable: true })
    userId: string;

    @Column({ name: 'FULL_NAME', type: 'varchar', length: 255, nullable: true })
    fullName: string;

    @Column({ name: 'ACTION', type: 'varchar', length: 255, nullable: true })
    action: string;

    @Column({ name: 'DEVICE', type: 'varchar', length: 255, nullable: true })
    device: string;
}
