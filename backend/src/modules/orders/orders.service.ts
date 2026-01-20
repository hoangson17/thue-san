import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/entities/cart.entity';
import { CartItem } from 'src/entities/CartItem.entity';
import { OrderItem } from 'src/entities/order-item.entity';
import { Order } from 'src/entities/order.entity';
import { Products } from 'src/entities/products.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrderStatus } from 'src/entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    // Hoặc tất cả cùng thành công, hoặc tất cả cùng rollback dataSource
    private readonly dataSource: DataSource,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Products) private productRepository: Repository<Products>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
  ) {}

  async checkout(userId: number, payment_method: string) {
    return this.dataSource.transaction(async (manager) => {
      const cart = await manager.findOne(Cart, {
        where: { user: { id: userId } },
        relations: ['items', 'items.product'],
        lock: { mode: 'pessimistic_write' },
      });

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Cart trống');
      }

      let total = 0;

      for (const item of cart.items) {
        const product = await manager.findOne(Products, {
          where: { id: item.product.id },
          lock: { mode: 'pessimistic_write' },
        });

        if (!product || !product.is_active) {
          throw new BadRequestException('Sản phẩm không hợp lệ');
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(`${product.name} không đủ số lượng`);
        }

        total += Number(product.price) * item.quantity;
      }

      const order = manager.create(Order, {
        user: { id: userId },
        total_price: total,
        payment_method: payment_method,
        status: OrderStatus.PENDING,
      });
      await manager.save(order);

      for (const item of cart.items) {
        await manager.save(OrderItem, {
          order,
          product: item.product,
          quantity: item.quantity,
          price: item.product.price,
        });

        await manager.decrement(
          Products,
          { id: item.product.id },
          'stock',
          item.quantity,
        );
      }

      await manager.delete(CartItem, { cart: { id: cart.id } });

      return manager.findOne(Order, {
        where: { id: order.id },
        relations: ['items', 'items.product'],
      });
    });
  }

  async buyNow(
    userId: number,
    body: { productId: number; quantity: number; paymentMethod: string },
  ) {
    return this.dataSource.transaction(async (manager) => {
      const { productId, quantity, paymentMethod } = body;

      const product = await manager.findOne(Products, {
        where: { id: productId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!product) {
        throw new BadRequestException('Sản phẩm không tồn tại');
      }

      if (product.stock < quantity) {
        throw new BadRequestException('Không đủ tồn kho');
      }

      const total = product.price * quantity;

      const order = manager.create(Order, {
        user: { id: userId },
        total_price: total,
        payment_method: paymentMethod,
        status: OrderStatus.PENDING,
      });

      await manager.save(order);

      await manager.save(OrderItem, {
        order,
        product,
        quantity,
        price: product.price,
      });

      await manager.decrement(Products, { id: product.id }, 'stock', quantity);

      return order;
    });
  }

  async findAllClient(
    userId: number,
    page?: number,
    limit?: number,
    order?: string,
  ) {
    if (!page || !limit) {
      return this.orderRepository.find({
        where: { user: { id: userId } },
        relations: ['items', 'items.product'],
        order: { created_at: order } as any,
      });
    }

    return this.orderRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: order } as any,
    });
  }
}
