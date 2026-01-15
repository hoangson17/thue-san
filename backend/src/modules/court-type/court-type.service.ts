import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourtType } from 'src/entities/courtType.entity';
import { Sport } from 'src/entities/sport.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CourtTypeService {
  constructor(
    @InjectRepository(CourtType)
    private courtTypeRepository: Repository<CourtType>,
    @InjectRepository(Sport) private sportRepository: Repository<Sport>,
  ) {}

  async findAll() {
    return this.courtTypeRepository.find({
      relations: ['sport_id'],
    });
  }

  async create(data: any) {
    return this.courtTypeRepository.save(data);
  }

  async update(id: number, data: any) {
    const courtType = await this.courtTypeRepository.findOneBy({ id });
    if (!courtType) throw new NotFoundException('Court type not found');
    const updatedCourtType = { ...courtType, ...data };
    return this.courtTypeRepository.update(id, updatedCourtType);
  }

  async delete(id: number) {
    const courtType = await this.courtTypeRepository.findOneBy({ id });
    if (!courtType) throw new NotFoundException('Court type not found');
    return this.courtTypeRepository.softRemove(courtType);
  }
}
