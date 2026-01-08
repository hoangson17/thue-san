import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'src/entities/categories.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private categoryRepository: Repository<Categories>,
  ) {}

  async findAll({
    page = 1,
    limit = 10,
    order = 'ASC',
    search,
  }: {
    page?: number;
    limit?: number;
    order?: 'ASC' | 'DESC';
    search?: string;
  }) {
    const where: any = {};
    if (search) {
      where.name = Like(`%${search}%`);
    }
    const [data, total] = await this.categoryRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { id: order },
    });
    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    return await this.categoryRepository.findOne({ where: { id } });
  }

  async create(data: any) {
    return await this.categoryRepository.save(data);
  }

  async update(id: number, data: any) {
    return await this.categoryRepository.update(id, data);
  }

  async delete(id: number) {
    return await this.categoryRepository.delete(id);
  }

  async softDelete(id: number) {
    return await this.categoryRepository.softDelete(id);
  }

  async restore(id: number) {
    return await this.categoryRepository.restore(id);
  }
}
