import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from 'src/entities/productImage.entity';
import { Products } from 'src/entities/products.entity';
import { In, IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

async findAll() {
  return this.productsRepository.find({
    relations: ['images'],
  });
}

async findByCategory(category: string) {
  return this.productsRepository.find({
    where: { category },
    relations: ['images'],
  });
}


  async findOne(id: number) {
    return await this.productsRepository.findOne({
      where: { id },
      relations: ['images'],
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

    await this.productsRepository.update(id, data);

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

      product.images = newImages;
    }

    return product;
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
