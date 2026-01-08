import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Court } from 'src/entities/court.entity';
import { CourtImage } from 'src/entities/courtImage.entity';
import { CourtPricings } from 'src/entities/courtPricings.entity';
import { CourtType } from 'src/entities/courtType.entity';
import { Sport } from 'src/entities/sport.entity';
import { In, Like, Repository } from 'typeorm';

@Injectable()
export class CourtService {
  constructor(
    @InjectRepository(Court) private courtRepository: Repository<Court>,
    @InjectRepository(CourtPricings)
    private courtPricingsRepository: Repository<CourtPricings>,
    @InjectRepository(CourtType)
    private courtTypeRepository: Repository<CourtType>,
    @InjectRepository(CourtImage)
    private courtImageRepository: Repository<CourtImage>,
    @InjectRepository(Sport) private sportRepository: Repository<Sport>,
  ) {}

  async findAll({
    page = 1,
    limit = 10,
    order = 'DESC',
    search,
  }: {
    page?: number;
    limit?: number;
    order?: 'ASC' | 'DESC' | string;
    search?: string;
  }) {
    const where: any = {};

    if (search) {
      where.name = Like(`%${search}%`);
    }

    return this.courtRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where,
      order: { createdAt: order as any },
      relations: {
        images: true,
        court_type: {
          sport_id: true,
        },
      },
    });
  }

  async findAllByCourtType(courtType: number) {
    return await this.courtRepository.find({
      relations: ['court_type'],
      where: {
        court_type: {
          id: In([courtType]),
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.courtRepository.findOne({
      where: { id },
      relations: {
        images: true,
        court_type: {
          sport_id: true,
        },
        court_pricings: true,
      },
    });
  }

  async create(data: any, files: Express.Multer.File[]) {
    const court = await this.courtRepository.save(data);
    const images = await Promise.all(
      files.map((file) =>
        this.courtImageRepository.save({
          url: `/uploads/court/${file.filename}`,
          court: court.id,
        }),
      ),
    );
    court.images = images;
    return court;
  }

  async update(id: number, data: any, files: Express.Multer.File[]) {
    return await this.courtRepository.update(id, data);
  }

  async delete(id: number) {
    return await this.courtRepository.delete(id);
  }

  async softDelete(id: number) {
    return await this.courtRepository.softDelete(id);
  }

  async restore(id: number) {
    return await this.courtRepository.restore(id);
  }

  async findAllCourtType() {
    return await this.courtTypeRepository.find();
  }

  async findOneCourtType(id: number) {
    return await this.courtTypeRepository.findOneBy({ id });
  }

  async createCourtType(data: any) {
    return await this.courtTypeRepository.save(data);
  }

  async updateCourtType(id: number, data: any) {
    return await this.courtTypeRepository.update(id, data);
  }

  async deleteCourtType(id: number) {
    return await this.courtTypeRepository.delete(id);
  }

  async softDeleteCourtType(id: number) {
    return await this.courtTypeRepository.softDelete(id);
  }

  async restoreCourtType(id: number) {
    return await this.courtTypeRepository.restore(id);
  }

  async findAllCourtTypeBySport(sport: number) {
    return await this.courtTypeRepository.find({
      relations: ['sport'],
      where: {
        sport_id: In([sport]),
      },
    });
  }

  async findCourtPrice(price: number) {
    return await this.courtPricingsRepository.find({
      where: { price_per_hour: price },
      relations: {
        court: {
          images: true,
        },
      },
    });
  }

  createPrice(data: any) {
    return this.courtPricingsRepository.save(data);
  }
}
