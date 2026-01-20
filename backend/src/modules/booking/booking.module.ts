import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/entities/booking.entity';
import { Court } from 'src/entities/court.entity';
import { AuthModule } from '../auth/auth.module';
import { User } from 'src/entities/user.entity';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forFeature([Booking,Court,User]),
    AuthModule
  ],
})
export class BookingModule {}
