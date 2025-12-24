import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatConversation } from '../entities/chat-conversation.entity';

@Injectable()
export class ChatConversationRepository {
  constructor(
    @InjectRepository(ChatConversation)
    private readonly repository: Repository<ChatConversation>,
  ) {}

  async create(
    userId: number,
    conversationId: string,
  ): Promise<ChatConversation> {
    const now = Date.now();
    const conversation = this.repository.create({
      USER_ID: userId,
      CONVERSATION_ID: conversationId,
      IS_ACTIVE: true,
      CREATED_AT: now,
      EXPIRES_AT: now + 24 * 60 * 60 * 1000, // 24 hours
    });
    return await this.repository.save(conversation);
  }

  async findByConversationId(
    conversationId: string,
  ): Promise<ChatConversation | null> {
    return await this.repository.findOne({
      where: { CONVERSATION_ID: conversationId, IS_ACTIVE: true },
    });
  }

  async findActiveByUserId(userId: number): Promise<ChatConversation | null> {
    const now = Date.now();
    return await this.repository
      .findOne({
        where: {
          USER_ID: userId,
          IS_ACTIVE: true,
        },
        order: { CREATED_AT: 'DESC' },
      })
      .then((conversation) => {
        // Check if conversation is expired
        if (conversation && conversation.EXPIRES_AT < now) {
          // Mark as inactive if expired
          this.repository.update({ ID: conversation.ID }, { IS_ACTIVE: false });
          return null;
        }
        return conversation;
      });
  }

  async deactivateByUserId(userId: number): Promise<void> {
    await this.repository.update(
      { USER_ID: userId, IS_ACTIVE: true },
      { IS_ACTIVE: false },
    );
  }

  async deactivateExpired(): Promise<void> {
    const now = Date.now();
    await this.repository
      .createQueryBuilder()
      .update(ChatConversation)
      .set({ IS_ACTIVE: false })
      .where('EXPIRES_AT < :now', { now })
      .andWhere('IS_ACTIVE = :active', { active: true })
      .execute();
  }
}
