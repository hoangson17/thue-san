import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ToumamentImage } from './toumamentImage.entity';
import { User } from './user.entity';

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

  @ManyToMany(()=>User, (users) => users.toumaments, {onDelete: 'CASCADE'})
  @JoinTable({
    name: 'toumament_users',
    joinColumn: {
      name: 'toumament_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: User[];
 
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
