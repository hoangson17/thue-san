import { Module } from '@nestjs/common';
import { CourtTypeService } from './court-type.service';
import { CourtTypeController } from './court-type.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourtType } from 'src/entities/courtType.entity';
import { Sport } from 'src/entities/sport.entity';

@Module({
  controllers: [CourtTypeController],
  providers: [CourtTypeService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forFeature([CourtType,Sport])
  ],
})
export class CourtTypeModule {}
