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
      relations: ['court'],
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
    const { court, ...pricingData } = data;

    const pricing = this.courtPricingsRepository.create(pricingData);

    if (court?.length) {
      pricing['court']= court.map((id: number) => ({ id }) as any);
    }

    return this.courtPricingsRepository.save(pricing);
  }

  async update(id: number, data: any) {
    const { court, ...pricingData } = data;

    const pricing = await this.courtPricingsRepository.findOne({
      where: { id },
      relations: ['court'],
    });

    if (!pricing) throw new Error('Not found');

    Object.assign(pricing, pricingData);

    if (court) {
      pricing.court = court.map((id: number) => ({ id }) as any);
    }

    return this.courtPricingsRepository.save(pricing);
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
