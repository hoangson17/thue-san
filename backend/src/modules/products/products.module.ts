import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { diskStorage } from 'multer';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from 'src/entities/products.entity';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import { ProductImage } from 'src/entities/productImage.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
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
    TypeOrmModule.forFeature([Products, ProductImage]),
  ],
})
export class ProductsModule {}
