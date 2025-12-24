import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ChatConversation } from './chat-conversation.entity';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ name: 'CONVERSATION_ID' })
  CONVERSATION_ID: string;

  @Column({ name: 'ROLE', type: 'enum', enum: ['user', 'assistant', 'system'] })
  ROLE: 'user' | 'assistant' | 'system';

  @Column({ name: 'CONTENT', type: 'text' })
  CONTENT: string;

  @Column({ name: 'INTENT', nullable: true })
  INTENT: string;

  @Column({
    name: 'MODE',
    type: 'enum',
    enum: ['analyze', 'qna'],
    nullable: true,
  })
  MODE: 'analyze' | 'qna';

  @CreateDateColumn({ name: 'CREATED_AT' })
  CREATED_AT: Date;

  @ManyToOne(() => ChatConversation, (conversation) => conversation.messages)
  @JoinColumn({
    name: 'CONVERSATION_ID',
    referencedColumnName: 'CONVERSATION_ID',
  })
  conversation: ChatConversation;
}
