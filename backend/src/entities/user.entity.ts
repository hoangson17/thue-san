import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, ManyToMany, JoinTable } from "typeorm";
import { MonthlySlots } from "./monthlySlots.entity";
import { Booking } from "./booking.entity";
import { MonthlyBooking } from "./monthyBooking.entity";
import { Cart } from "./cart.entity";
import { Toumament } from "./toumament.entity";

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

    @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
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
    
    @OneToOne(() => Cart, cart => cart.user) 
    cart: Cart; 

    @ManyToMany(()=>Toumament, (toumament) => toumament.users)
    toumaments: Toumament[]; 

    @Column({ type: 'text', nullable: true })
    avatar: string;

    @Column({ type: 'varchar', length: 10 , nullable: true})
    provider: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;
}
