import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Toumament } from './toumament.entity';
import { Exclude } from 'class-transformer';

@Entity('toumament_images')
export class ToumamentImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  url: string;

  @ManyToOne(() => Toumament, (t) => t.images, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'toumament_id' })
  @Exclude()
  toumament: Toumament;
}
