import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/entities/cart.entity';
import { CartItem } from 'src/entities/CartItem.entity';
import { User } from 'src/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { Products } from 'src/entities/products.entity';

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forFeature([Cart, CartItem,User, Products]),
    AuthModule
  ],
})
export class CartModule {}
