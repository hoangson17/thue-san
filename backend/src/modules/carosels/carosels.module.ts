import { Module } from '@nestjs/common';
import { CaroselsService } from './carosels.service';
import { CaroselsController } from './carosels.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carosel } from 'src/entities/carosel.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  controllers: [CaroselsController],
  providers: [CaroselsService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([Carosel]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/carosels',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`); // Tên file ngẫu nhiên
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn 10MB
      fileFilter: (req, file, cb) => {
        // Lọc file
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          cb(null, true); // Cho phép
        } else {
          cb(null, false); // Từ chối
        }
      },
    }),
  ],
})
export class CaroselsModule {}
