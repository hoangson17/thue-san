import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Toumament } from 'src/entities/toumament.entity';
import { ToumamentImage } from 'src/entities/toumamentImage.entity';
import { User } from 'src/entities/user.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class ToumamentService {
  constructor(
    @InjectRepository(Toumament)
    private toumamentRepository: Repository<Toumament>,
    @InjectRepository(ToumamentImage)
    private toumamentImageRepository: Repository<ToumamentImage>,
    @InjectRepository(User) private userRepository: Repository<User>,
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
    return this.toumamentRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where,
      relations: {
        images: true,
        users: true,
      },
      order: { createdAt: order as any },
    });
  }

  // findOne(id: number) {
  //   return this.toumamentRepository.findOne({
  //     where: { id },
  //     relations: {
  //       images: true,
  //       users: true,
  //     },
  //   });
  // }
  findOne(id: number) {
    return this.toumamentRepository
      .createQueryBuilder('toumament')
      .leftJoinAndSelect('toumament.images', 'images')
      .leftJoinAndSelect('toumament.users', 'users')
      .where('toumament.id = :id', { id })
      .getOne();
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

  async toumamentRegister(toumamentId: number, userId: number) {
    const toumament = await this.toumamentRepository.findOne({
      where: { id: toumamentId },
      relations: ['users'],
    });
    if (!toumament) {
      throw new Error('Toumament not found');
    }
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }
    delete (user as any).password;
    return this.toumamentRepository.save({
      ...toumament,
      users: [...toumament.users, user],
    });
  }
}
