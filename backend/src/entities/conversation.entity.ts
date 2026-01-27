import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { Message } from './message.entity'

export enum ConversationStatus {
  WAITING = 'waiting',
  ACTIVE = 'active',
  CLOSED = 'closed',
}

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: number

  @Column({ nullable: true })
  adminId: number

  @Column({
    type: 'enum',
    enum: ConversationStatus,
    default: ConversationStatus.WAITING,
  })
  status: ConversationStatus

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
