import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { CourtModule } from './modules/court/court.module';
import { SportModule } from './modules/sport/sport.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ProductsModule } from './modules/products/products.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CaroselsModule } from './modules/carosels/carosels.module';
import { BookingModule } from './modules/booking/booking.module';
import { ToumamentModule } from './modules/toumament/toumament.module';
import { SupportModule } from './modules/support/support.module';
import { UsersModule } from './modules/users/users.module';
import { CartModule } from './modules/cart/cart.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { PricesModule } from './modules/prices/prices.module';
import { CourtTypeModule } from './modules/court-type/court-type.module';
import { OrdersModule } from './modules/orders/orders.module';
import { BullModule } from '@nestjs/bullmq';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import Mail from './utils/mail';
import { EmailConsumer } from './consumer/email.consumer';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT as unknown as number,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/entities/*.entity{.ts,.js}'],
      synchronize:
        process.env.NODE_ENV === 'development' || !process.env.NODE_ENV,
      logging: true,
    }),
    AuthModule,
    RedisModule.forRoot({
      type: 'single',
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    CourtModule,
    SportModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
    MailerModule.forRoot({
      transport: `smtps://${process.env.MAIL_USERNAME}:${process.env.MAIL_PASSWORD}@${process.env.MAIL_HOST}`,
      defaults: {
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM}>`,
      },
      template: {
        dir: __dirname + '/mail/templates',
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ProductsModule,
    CaroselsModule,
    BookingModule,
    ToumamentModule,
    SupportModule,
    UsersModule,
    CartModule,
    CategoriesModule,
    PricesModule,
    CourtTypeModule,
    OrdersModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, Mail, EmailConsumer],
})
export class AppModule {}
