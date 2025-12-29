import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Toumament } from 'src/entities/toumament.entity';
import { ToumamentImage } from 'src/entities/toumamentImage.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ToumamentService {
  constructor(
    @InjectRepository(Toumament)
    private toumamentRepository: Repository<Toumament>,
    @InjectRepository(ToumamentImage)
    private toumamentImageRepository: Repository<ToumamentImage>,
  ) {}

  findAll({ page, limit }: { page?: number; limit?: number }) {
    if (!page || !limit) {
      return this.toumamentRepository.findAndCount();
    }

    return this.toumamentRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: { images: true },
      order: { createdAt: 'DESC' },
    })
  }

  findOne(id: number) {
    return this.toumamentRepository.findOne({
      where: { id },
      relations: { images: true },
    });
  }

  async create(data: any, files: Express.Multer.File[]) {
    const toumament = await this.toumamentRepository.save(data);
    const images = await Promise.all(
      files.map((file) =>
        this.toumamentImageRepository.save({
          url: `/uploads/toumament/${file.filename}`,
          toumament: toumament.id,
        }),
      ),
    );
    toumament.images = images;
    return toumament;
  }

  async update(id: number, data: any, files?: Express.Multer.File[]) {
    const toumament = await this.toumamentRepository.findOne({
      where: { id },
      relations: ['images'],
    });

    if (!toumament) throw new Error('Toumament not found');

    await this.toumamentRepository.save({
      ...toumament,
      ...data,
    });

    if (files?.length) {
      await this.toumamentImageRepository.delete({ toumament: toumament });
      await Promise.all(
        files.map((file) =>
          this.toumamentImageRepository.save({
            url: `/uploads/toumament/${file.filename}`,
            toumament: { id },
          }),
        ),
      );
    }

    return this.toumamentRepository.findOne({
      where: { id },
      relations: ['images'],
    });
  }

  delete(id: number) {
    return this.toumamentRepository.delete(id);
  }

  softDelete(id: number) {
    return this.toumamentRepository.softDelete(id);
  }

  restore(id: number) {
    return this.toumamentRepository.restore(id);
  }
}
