import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { OrderItem } from "./order-item.entity";

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCEL = 'cancel'
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total_price: number;

  @Column()
  payment_method: string; // COD | PAYPAL

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  status: OrderStatus;

  @OneToMany(() => OrderItem, item => item.order)
  items: OrderItem[];

  @Column({ type: 'timestamp' , default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
