import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/entities/cart.entity';
import { CartItem } from 'src/entities/CartItem.entity';
import { Order } from 'src/entities/order.entity';
import { OrderItem } from 'src/entities/order-item.entity';
import { Products } from 'src/entities/products.entity';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([Cart, CartItem, Order, OrderItem, Products]),
    BullModule.registerQueue({
      name: 'order',
    }),
    AuthModule
  ],
})
export class OrdersModule {}
