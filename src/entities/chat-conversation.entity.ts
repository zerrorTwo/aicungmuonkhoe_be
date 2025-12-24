import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { ChatMessage } from './chat-message.entity';

@Entity('chat_conversations')
export class ChatConversation {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ name: 'CONVERSATION_ID', unique: true })
  CONVERSATION_ID: string;

  @Column({ name: 'USER_ID' })
  USER_ID: number;

  @Column({ name: 'IS_ACTIVE', default: true })
  IS_ACTIVE: boolean;

  @Column({ name: 'CREATED_AT', type: 'bigint' })
  CREATED_AT: number;

  @Column({ name: 'EXPIRES_AT', type: 'bigint' })
  EXPIRES_AT: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'USER_ID' })
  user: User;

  @OneToMany(() => ChatMessage, (message) => message.conversation)
  messages: ChatMessage[];
}
