import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ToumamentImage } from './toumamentImage.entity';

@Entity('toumaments')
export class Toumament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  details: string;

  @Column({ type: 'varchar', length: 50 })
  price: string;

  @Column({ type: 'varchar', length: 200 })
  address: string;

  @Column({ type: 'timestamp' , nullable: true})
  start_date: Date;

  @Column({ type: 'varchar', length: 50 })
  organizer: string;

  @OneToMany(
    () => ToumamentImage,
    (image) => image.toumament,
    { cascade: true },
  )
  images: ToumamentImage[];

  @Column({ type: 'text' })
  introduce: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
