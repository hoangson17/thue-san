import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { MonthlySlots } from './monthlySlots.entity';

export enum Status {
  PENDING = 'pending',
  PAID = 'paid',
  CANCEL = 'cancel',
}

@Entity('monthly_bookings')
export class MonthlyBooking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.monthly_bookings)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(
    () => MonthlySlots,
    (monthly_slots) => monthly_slots.monthly_booking,
  )
  @JoinColumn({ name: 'slots_id' })
  monthly_slots: MonthlySlots[];

  @Column({ type: 'varchar', length: 100 })
  month: string;

  @Column({ type: 'enum', enum: Status, default: Status.PENDING })
  status: Status;
}
