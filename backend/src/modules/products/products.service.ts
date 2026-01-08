import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from 'src/entities/productImage.entity';
import { Products } from 'src/entities/products.entity';
import { In, IsNull, Like, Not, Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async findAll({
    page = 1,
    limit = 10,
    category,
    search,
  }: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }) {
    const where: any = {};
    if (category) {
      where.category = { name: category };
    }
    if (search) {
      where.name = Like(`%${search}%`);
    }
    return this.productsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where,
      relations: ['images', 'category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    return await this.productsRepository.findOne({
      where: { id },
      relations: ['images', 'category'],
    });
  }

  async createProduct(data: any, files: Express.Multer.File[]) {
    const product = await this.productsRepository.save(data);

    const images = await Promise.all(
      files.map((file) =>
        this.productImageRepository.save({
          url: `/uploads/products/${file.filename}`,
          product: product.id,
        }),
      ),
    );
    product.images = images;
    return product;
  }

  async updateProduct(id: number, data: any, files?: Express.Multer.File[]) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['images'],
    });

    if (!product) throw new Error('Product not found');
    const newProduct = { ...product, ...data };
    delete newProduct.images;
    await this.productsRepository.update(id, newProduct);
    if (files && files.length > 0) {
      await this.productImageRepository.delete({ product: product });
      const newImages = await Promise.all(
        files.map((file) =>
          this.productImageRepository.save({
            url: `/uploads/products/${file.filename}`,
            product: product.id as any,
          }),
        ),
      );
      newProduct.images = newImages;
    }

    return newProduct;
  }

  async deleteProduct(id: number) {
    await this.productsRepository.delete(id);
  }

  async softDeleteProduct(id: number) {
    await this.productsRepository.softDelete(id);
  }

  async restoreProduct(id: number) {
    await this.productsRepository.restore(id);
  }

  async softDeleted() {
    return await this.productsRepository.find({
      where: {
        deletedAt: Not(IsNull()),
      },
      withDeleted: true,
      relations: ['images'],
    });
  }

  async deleteImage(id: number) {
    await this.productImageRepository.delete(id);
  }
}
