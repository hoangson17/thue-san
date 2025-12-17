import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Court } from './court.entity';

@Entity('court_images')
export class CourtImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  url: string;

  @ManyToOne(() => Court, (court) => court.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'court_id' }) 
  court: Court;
}
 