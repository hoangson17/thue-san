import { Module } from '@nestjs/common';
import { ToumamentService } from './toumament.service';
import { ToumamentController } from './toumament.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Toumament } from 'src/entities/toumament.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ToumamentImage } from 'src/entities/toumamentImage.entity';
import { ToumamentRegisterController } from './toumament-register.controller';
import { User } from 'src/entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ToumamentController, ToumamentRegisterController],
  providers: [ToumamentService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forFeature([Toumament,ToumamentImage,User]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/toumament',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        }
      }),
      limits: {
        fileSize: 1024 * 1024 * 10
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          cb(null, true);
        } else {
          cb(null, false);
        }
      }
    }),
    AuthModule
  ],
})
export class ToumamentModule {}
