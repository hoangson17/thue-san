import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { CartItem } from "./CartItem.entity";

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, user => user.cart, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => CartItem, item => item.cart, {onDelete: 'CASCADE'})
  items: CartItem[];
}
