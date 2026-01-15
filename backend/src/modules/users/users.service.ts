import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { IsNull, Like, Not, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getAllUsers({
    page = 1,
    limit = 8,
    order = 'DESC',
    search,
    role,
  }: {
    page?: number;
    limit?: number;
    order?: 'ASC' | 'DESC';
    search?: string;
    role?: string;
  }) {
    const qb = this.userRepository.createQueryBuilder('user');
    qb.where('user.deletedAt IS NULL');
    if (role) {
      qb.andWhere('user.role = :role', { role });
    }
    if (search) {
      qb.andWhere('(user.name LIKE :search OR user.email LIKE :search)', {
        search: `%${search}%`,
      });
    }
    qb.orderBy('user.id', order)
      .skip((page - 1) * limit)
      .take(limit);
    const [data, total] = await qb.getManyAndCount();
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        toumaments: {
          images: true,
        },
      },
    });

    if (!user) return null;

    delete (user as any).password;
    return user;
  }

  async softDelete(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return this.userRepository.softDelete(user.id);
  }

  async restore(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.deletedAt) {
      throw new BadRequestException('User is not locked');
    }
    return await this.userRepository.restore(id);
  }

  async delete(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!user) throw new NotFoundException('User not found');
    return this.userRepository.delete(user.id);
  }

  async findUserLocked({
    page = 1,
    limit = 8,
    order = 'DESC',
    search,
    role,
  }: {
    page?: number;
    limit?: number;
    order?: 'ASC' | 'DESC';
    search?: string;
    role?: string;
  }) {
    const qb = this.userRepository
      .createQueryBuilder('user')
      .withDeleted()
      .where('user.deletedAt IS NOT NULL');

    if (role) {
      qb.andWhere('user.role = :role', { role });
    }

    if (search) {
      qb.andWhere('(user.name LIKE :search OR user.email LIKE :search)', {
        search: `%${search}%`,
      });
    }

    qb.orderBy('user.id', order)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
