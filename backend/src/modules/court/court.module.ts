import { Module } from '@nestjs/common';
import { CourtService } from './court.service';
import { CourtController } from './court.controller';
import { Court } from 'src/entities/court.entity';
import { CourtType } from 'src/entities/courtType.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Sport } from 'src/entities/sport.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CourtImage } from 'src/entities/courtImage.entity';

@Module({
  controllers: [CourtController],
  providers: [CourtService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([Court, CourtType, Sport, CourtImage]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/court', // Thư mục đích
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
export class CourtModule {}
