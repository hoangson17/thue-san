import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking, Status } from 'src/entities/booking.entity';
import { Court } from 'src/entities/court.entity';
import { User } from 'src/entities/user.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Court)
    private readonly courtRepository: Repository<Court>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    return await this.bookingRepository.find({
      relations: ['court', 'user'],
    });
  }

  async findAllByUser(userId: number) {
    return await this.bookingRepository.find({
      relations: ['court', 'user'],
      where: { user: { id: userId } },
    });
  }

  async findAllAdmin(page = 1, limit = 8, order?: string, search?: string) {
    const safeOrder: 'ASC' | 'DESC' =
      order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const [data, total] = await this.bookingRepository.findAndCount({
      relations: ['court', 'user'],
      where: search
        ? [
            { user: { name: Like(`%${search}%`) } },
            { court: { name: Like(`%${search}%`) } },
          ]
        : {},
      order: {
        date: safeOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(userId: number, body: any) {
    const { court_id, date, time_start, time_end, total_price } = body;

    const court = await this.courtRepository.findOne({
      where: { id: court_id },
    });

    if (!court) {
      throw new BadRequestException('Sân không tồn tại');
    }
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User không tồn tại');
    }
    const dateString = `${date}`;
    const startDateTime = `${time_start}`;
    const endDateTime = `${time_end}`;
    console.log(startDateTime + '-' + endDateTime);

    if (endDateTime <= startDateTime) {
      throw new BadRequestException('Giờ kết thúc phải lớn hơn giờ bắt đầu');
    }

    const conflict = await this.bookingRepository
      .createQueryBuilder('b')
      .where('b.court_id = :courtId', { courtId: court_id })
      .andWhere('b.date = :date', { date })
      .andWhere('b.status != :cancel', { cancel: Status.CANCEL })
      .andWhere(':start < b.time_end AND :end > b.time_start', {
        start: startDateTime,
        end: endDateTime,
      })
      .getOne();

    if (conflict) {
      throw new BadRequestException('Khung giờ đã được đặt');
    }

    const booking = this.bookingRepository.create({
      court,
      user,
      date,
      time_start: startDateTime,
      time_end: endDateTime,
      total_price,
      status: Status.PENDING,
    } as any);

    return await this.bookingRepository.save(booking);
  }
}
