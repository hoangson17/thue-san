import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CourtType } from "./courtType.entity";
import { CourtPricings } from "./courtPricings.entity";
import { MonthlySlots } from "./monthlySlots.entity";
import { Booking } from "./booking.entity";
import { CourtImage } from "./courtImage.entity";

@Entity('courts')
export class Court {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=>CourtType, court_type => court_type.courts)
    @JoinColumn({name: 'court_type'})
    court_type: CourtType

    @OneToMany(()=>CourtPricings, court_pricings => court_pricings.court)
    court_pricings: CourtPricings[]

    @OneToMany(()=>MonthlySlots, monthly_slots => monthly_slots.court)
    monthly_slots: MonthlySlots[];

    @OneToMany(()=>Booking, booking => booking.court)
    bookings: Booking[]; 

    @OneToMany(()=>CourtImage, court_image => court_image.court)
    @JoinColumn({name: 'image_id'}) 
    images: CourtImage[]

    @Column({ type: 'varchar', length: 100 }) 
    name: string

    @Column({ type: 'varchar', length: 100 })
    note: string

    @Column({ type: 'text', nullable: true })
    description: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;  
} 