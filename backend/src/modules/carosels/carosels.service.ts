import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Carosel } from 'src/entities/carosel.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CaroselsService {
  constructor(
    @InjectRepository(Carosel) private caroselsRepository: Repository<Carosel>,
  ) {}

  findAll() {
    return this.caroselsRepository.find();
  }

  findOne(id: number) {
    return this.caroselsRepository.findOne({ where: { id } });
  }

  create(data: any, file: Express.Multer.File) {
    return this.caroselsRepository.save({
      ...data,
      url: `/uploads/carosels/${file.filename}`,
    });
  }

  async update(id: number, data: any, file?: Express.Multer.File) {
    const carosel = await this.findOne(id);
    if (!carosel) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }
    const updateData: any = { ...data };
    if (file) {
      updateData.url = `/uploads/carosels/${file.filename}`;
    }
    return this.caroselsRepository.update(id, updateData);
  }

  softDelete(id: number) {
    return this.caroselsRepository.softDelete({ id });
  }

  restore(id: number) {
    return this.caroselsRepository.restore({ id });
  }

  delete(id: number) {
    return this.caroselsRepository.delete({ id });
  }
}
