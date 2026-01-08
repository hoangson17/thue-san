import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/entities/cart.entity';
import { CartItem } from 'src/entities/CartItem.entity';
import { Products } from 'src/entities/products.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Products) private productRepository: Repository<Products>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return false;
    }
    return this.cartRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        items: {
          product: {
            images: true,
          },
        },
      },
    });
  }

  async addToCart(userId: number, productId: number, quantity: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['cart'],
    });

    if (!user || !user.cart) {
      return false;
    }

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) return false;

    let cartItem = await this.cartItemRepository.findOne({
      where: { cart: { id: user.cart.id }, product: { id: productId } },
      relations: ['cart', 'product'],
    });

    if (cartItem) {
      cartItem.quantity = (Number(cartItem.quantity) || 0) + Number(quantity);
    } else {
      cartItem = this.cartItemRepository.create({
        cart: user.cart,
        product,
        quantity,
      });
    }

    await this.cartItemRepository.save(cartItem);

    return cartItem;
  }

  async removeFromCart(userId: number, productId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['cart'],
    });
    if (!user || !user.cart) {
      return false;
    }
    const cartItem = await this.cartItemRepository.findOne({
      where: { cart: { id: user.cart.id }, product: { id: productId } },
      relations: ['cart', 'product'],
    });
    if (!cartItem) return false;
    await this.cartItemRepository.delete(cartItem);
    return true;
  }
}
