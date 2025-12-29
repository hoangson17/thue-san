import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Support } from 'src/entities/support.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SupportService {
    constructor(@InjectRepository(Support) private supportRepository: Repository<Support>) {}

    async createSupport(body: any) {
        return await this.supportRepository.save(body);
    }

    async getSupport() {
        return await this.supportRepository.find();
    }

    async deleteSupport(id: number) {
        return await this.supportRepository.delete(id);
    }

    async updateSupport(id: number, body: any) {
        return await this.supportRepository.update(id, body);
    }

    async getSupportById(id: number) {
        return await this.supportRepository.findOneBy({ id });
    }

    

}
