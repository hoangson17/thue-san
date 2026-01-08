import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourtPricings } from 'src/entities/courtPricings.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class PricesService {
  constructor(
    @InjectRepository(CourtPricings)
    private courtPricingsRepository: Repository<CourtPricings>,
  ) {}

  async findAll({
    page,
    limit,
    order,
    search,
  }: {
    page?: number;
    limit?: number;
    order?: string;
    search?: string;
  }) {
    const where: any = {};
    if (search) {
      where.name = Like(`%${search}%`);
    }
    const options: any = {
      where,
      order: { createdAt: order },
    };
    if (page && limit) {
      options.skip = (page - 1) * limit;
      options.take = limit;
    }

    return this.courtPricingsRepository.findAndCount(options);
  }

  async findOne(id: number) {
    return this.courtPricingsRepository.findOne(id as any);
  }

  async create(data: any) {
    return this.courtPricingsRepository.save(data);
  }

  async update(id: number, data: any) {
    return this.courtPricingsRepository.update(id, data);
  }

  async delete(id: number) {
    return this.courtPricingsRepository.delete(id);
  }
  
  async softDelete(id: number) {
    return this.courtPricingsRepository.softDelete(id);
  }

  async restore(id: number) {
    return this.courtPricingsRepository.restore(id);
  }

}
