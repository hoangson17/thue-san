import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Sport } from "./sport.entity";

@Entity('court_types')
export class CourtType {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Sport, (sport) => sport.courtTypes,{
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'sport_id' }) 
    sport_id: Sport;

    @Column({ type: 'varchar', length: 100 })
    name: string

    @OneToMany(() => CourtType, (court_type) => court_type.sport_id,{
        onDelete: 'CASCADE' 
    })
    courts: CourtType[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date; 
}