import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Court } from "./court.entity";
import { User } from "./user.entity";

export enum Status {
    PENDING = 'pending',
    PAID = 'paid',
    CANCEL = 'cancel'
}

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(()=>Court, court => court.bookings)
    @JoinColumn({name: 'court_id'})
    court: Court;

    @ManyToOne(()=>User, user => user.bookings)
    @JoinColumn({name: 'user_id'})
    user: User;

    @Column({
        type: "date"
    })
    date: string

    @Column({
        type: "time"
    })
    time_start: string

    @Column({
        type: "time"
    })
    time_end: string

    @Column({
        type: "float"
    })
    total_price: number

    @Column({
        type: "enum",
        enum: Status,
        default: Status.PENDING
    })
    status: Status

}