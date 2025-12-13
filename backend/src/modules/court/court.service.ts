import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Court } from 'src/entities/court.entity';
import { CourtType } from 'src/entities/courtType.entity';
import { Sport } from 'src/entities/sport.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class CourtService {
    constructor(
        @InjectRepository(Court) private courtRepository: Repository<Court>,
        @InjectRepository(CourtType) private courtTypeRepository: Repository<CourtType>,
        @InjectRepository(Sport) private sportRepository: Repository<Sport>,
    ) {}

    async findAll() {
        return await this.courtRepository.find({
            relations: ['court_type'],
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
        return await this.courtRepository.findOneBy({ id });
    }

    async create(data: any) {
        return await this.courtRepository.save(data);
    }

    async update(id: number, data: any) {
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
}
