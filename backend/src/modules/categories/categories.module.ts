import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from 'src/entities/categories.entity';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forFeature([Categories])
  ],
})
export class CategoriesModule {}
