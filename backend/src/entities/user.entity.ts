import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { MonthlySlots } from "./monthlySlots.entity";
import { Booking } from "./booking.entity";
import { MonthlyBooking } from "./monthyBooking.entity";
import { Cart } from "./cart.entity";

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin'
}

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
    phone: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    password: string;

    @Column({ type: 'tinyint', nullable: true })
    gender: number;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole;

    @OneToMany(()=>MonthlySlots, monthly_slots => monthly_slots.user)
    monthly_slots: MonthlySlots[];

    @OneToMany(()=>Booking, booking => booking.user)
    bookings: Booking[];

    @OneToMany(()=>MonthlyBooking, monthly_booking => monthly_booking.user)
    monthly_bookings: MonthlyBooking[];
    
    @OneToMany(() => Cart, cart => cart.user)
    carts: Cart[];

    @Column({ type: 'varchar', nullable: true })
    avatar: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;
}
