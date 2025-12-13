import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sport } from 'src/entities/sport.entity';
import { IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class SportService {
    constructor(
        @InjectRepository(Sport) private sportRepository: Repository<Sport>,
    ) {}

    async findAll() {
        return this.sportRepository.find();
    }

    async findAllSoftDeleted() {
        return this.sportRepository.find({
            withDeleted: true,
        });
    }

    async softDeleted() {
        return this.sportRepository.find({
            where: {
                deletedAt: Not(IsNull()),
            },
            withDeleted: true,
        });
    }

    async findOne(id: number) {
        return this.sportRepository.findOneBy({ id });
    }

    async create(data: any) {
        return this.sportRepository.save(data);
    }

    async update(id: number, data: any) {
        const sport = await this.sportRepository.findOneBy({ id });
        if(!sport) throw new Error('Sport not found');
        const updatedSport = { ...sport, ...data }; 
        await this.sportRepository.update(id, data);
        return updatedSport;
    }

    async delete(id: number) {
        return this.sportRepository.delete(id);
    }

    async softDelete(id: number) {
        return this.sportRepository.softDelete(id);
    }

    async restore(id: number) {
        return this.sportRepository.restore(id);
    }


    
}
