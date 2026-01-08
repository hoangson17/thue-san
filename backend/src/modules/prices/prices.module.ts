import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourtPricings } from 'src/entities/courtPricings.entity';

@Module({
  controllers: [PricesController],
  providers: [PricesService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forFeature([CourtPricings]),
  ]
})
export class PricesModule {}
