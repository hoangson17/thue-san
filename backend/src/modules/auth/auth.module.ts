import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { Cart } from 'src/entities/cart.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  controllers: [AuthController],
  providers: [AuthService,AuthGuard],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forFeature([User,Cart]),
    JwtModule.register  ({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_TOKEN_EXPIRED as unknown as number },
    }), 
    MulterModule.register({
          storage: diskStorage({
            destination: './uploads/avatar', // Thư mục đích
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
  exports:[AuthService,AuthGuard]
})
export class AuthModule {}
