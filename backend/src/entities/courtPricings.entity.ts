import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Court } from './court.entity';

export enum DayType {
  WEEKDAY = 'weekday',
  WEEKEND = 'weekend',
}

@Entity('court_pricings')
export class CourtPricings {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Court, (court) => court.court_pricings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'court_id' })
  court: Court;

  @Column({
    type: 'enum',
    enum: DayType,
    default: DayType.WEEKDAY,
  })
  dayType: DayType;

  @Column({ type: 'varchar', length: 100 })
  timeStart: string;

  @Column({ type: 'varchar', length: 100 })
  timeEnd: string;

  @Column({ type: 'float' })
  price_per_hour: number;
}
