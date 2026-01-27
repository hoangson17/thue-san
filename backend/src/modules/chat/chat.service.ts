// chat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation, ConversationStatus } from 'src/entities/conversation.entity';
import { Message } from 'src/entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation) private conversationRepo: Repository<Conversation>,
    @InjectRepository(Message) private messageRepo: Repository<Message>,
  ) {}

  async getOrCreateConversation(userId: number) {
    let convo = await this.conversationRepo.findOne({
      where: [
        { userId, status: ConversationStatus.WAITING },
        { userId, status: ConversationStatus.ACTIVE },
      ],
    });
    if (!convo) {
      convo = this.conversationRepo.create({ userId });
      await this.conversationRepo.save(convo);
    }
    return convo;
  }

  async getAllConversations() {
    // Sửa: Thêm relations để Admin thấy được tin nhắn cũ
    return this.conversationRepo.find({
      order: { updatedAt: 'DESC' },
      relations: ['messages'],
    });
  }

  async createMessage(conversationId: number, senderType: 'user' | 'admin', senderId: number, content: string) {
    const msg = this.messageRepo.create({ conversationId, senderType, senderId, content });
    await this.conversationRepo.update(conversationId, { updatedAt: new Date() }); // Cập nhật thời gian hội thoại
    return this.messageRepo.save(msg);
  }

  async getMessages(conversationId: number) {
    return this.messageRepo.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
    });
  }

  async markUserMessagesAsRead(conversationId: number) {
    await this.messageRepo.update({ conversationId, senderType: 'user', isRead: false }, { isRead: true });
  }

  async claimConversation(conversationId: number, adminId: number) {
    await this.conversationRepo.update(conversationId, { adminId, status: ConversationStatus.ACTIVE });
    return this.conversationRepo.findOne({ where: { id: conversationId }, relations: ['messages'] });
  }
}