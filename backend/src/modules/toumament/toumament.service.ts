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

  findAll() {
    return this.toumamentRepository.find({
      relations: {
        images: true,
      },
    });
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

async update(
  id: number,
  data: any,
  files?: Express.Multer.File[],
) {
  const toumament = await this.toumamentRepository.findOne({
    where: { id },
    relations: ['images'],
  });

  if (!toumament) throw new Error('Toumament not found');

  // 1. Xóa ảnh cũ (file + DB)
  if (toumament.images?.length) {
    await Promise.all(
      toumament.images.map(async (image) => {
        const filePath = path.join(
          process.cwd(),
          image.url.replace(/^\//, ''),
        );

        try {
          await fs.unlink(filePath); // xóa file
        } catch (err) {
        }

        await this.toumamentImageRepository.delete(image.id); // xóa DB
      }),
    );
  }

  await this.toumamentRepository.save({
    ...toumament,
    ...data,
  });

  if (files?.length) {
    await Promise.all(
      files.map((file) =>
        this.toumamentImageRepository.save({
          url: `/uploads/toumament/${file.filename}`,
          toumament: { id }, // tránh circular
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
