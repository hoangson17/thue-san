import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('supports')
export class Support {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 100 , nullable: true})
    email: string;

    @Column({ type: 'varchar', length: 10 })
    phone: string;

    @Column({ type: 'text', nullable: true })
    message: string

    @Column({ type: 'tinyint' , default: 0})
    status: number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date
}