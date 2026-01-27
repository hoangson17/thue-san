import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Conversation } from './conversation.entity'

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  conversationId: number

  @Column({
    type: 'enum',
    enum: ['user', 'admin'],
  })
  senderType: 'user' | 'admin'

  @Column()
  senderId: number

  @Column('text')
  content: string

  @Column({ default: false })
  isRead: boolean;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversationId' })
  conversation: Conversation

  @CreateDateColumn()
  createdAt: Date
}
