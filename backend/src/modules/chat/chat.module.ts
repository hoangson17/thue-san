import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from 'src/entities/conversation.entity';
import { Message } from 'src/entities/message.entity';
import { ConfigModule } from '@nestjs/config';
import { EventGateway } from 'src/gateway/event/event.gateway';
import { AdminChatController } from './admin-chat.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ChatController, AdminChatController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([Conversation, Message]),
    AuthModule,
  ],
  providers: [ChatService, EventGateway],
}) 
export class ChatModule {}
