import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('carosels')
export class Carosel {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "text"})
    url: string;

    @Column({ type: "varchar", length: 20 })
    description: string;
    
    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;
}