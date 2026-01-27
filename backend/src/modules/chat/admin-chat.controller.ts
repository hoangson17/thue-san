import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from 'src/entities/conversation.entity';
import { AuthGuard } from 'src/guard/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('admin/chat')
export class AdminChatController {
  constructor(
    @InjectRepository(Conversation)
    private readonly convoRepo: Repository<Conversation>,
  ) {}

  @Get('conversations')
  findAll() {
    return this.convoRepo.find({
      order: { createdAt: 'DESC' },
      relations: ['messages'],
    });
  }
}
