import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Court } from "./court.entity";
import { User } from "./user.entity";
import { MonthlyBooking } from "./monthyBooking.entity";

export enum Status {
    PENDING = 'pending',
    PAID = 'paid',
    CANCEL = 'cancel'
}

@Entity('monthly_slots')
export class MonthlySlots {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Court, court => court.monthly_slots, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'court_id' })
    court: Court;

    @ManyToOne(() => User, user => user.monthly_slots, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => MonthlyBooking, monthly_booking => monthly_booking.monthly_slots, {
        onDelete: 'CASCADE'
    })
    monthly_booking: MonthlyBooking;

    @Column()
    court_id: number;

    @Column({ type: "timestamp" })
    timeStart: Date;

    @Column({ type: "timestamp" })
    timeEnd: Date;

    @Column({ type: "float" })
    total_price: number;

    @Column({
        type: "enum",
        enum: Status,
        default: Status.PENDING
    })
    status: Status;
}
