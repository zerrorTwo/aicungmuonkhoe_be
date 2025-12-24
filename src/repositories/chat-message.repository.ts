import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from '../entities/chat-message.entity';

@Injectable()
export class ChatMessageRepository {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly repository: Repository<ChatMessage>,
  ) {}

  async create(data: {
    conversationId: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    intent?: string;
    mode?: 'analyze' | 'qna';
  }): Promise<ChatMessage> {
    const message = this.repository.create({
      CONVERSATION_ID: data.conversationId,
      ROLE: data.role,
      CONTENT: data.content,
      INTENT: data.intent,
      MODE: data.mode,
    });
    return await this.repository.save(message);
  }

  async findByConversationId(
    conversationId: string,
    limit: number = 10,
  ): Promise<ChatMessage[]> {
    return await this.repository.find({
      where: { CONVERSATION_ID: conversationId },
      order: { CREATED_AT: 'DESC' },
      take: limit,
    });
  }

  async getHistory(
    conversationId: string,
    limit: number = 10,
  ): Promise<{ role: string; content: string }[]> {
    const messages = await this.findByConversationId(conversationId, limit);
    return messages.reverse().map((msg) => ({
      role: msg.ROLE,
      content: msg.CONTENT,
    }));
  }
}
