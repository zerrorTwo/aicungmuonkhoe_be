import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { CreateCommentDto } from '../dtos/community.dto';

/**
 * Repository for Comment entity
 * Handles all database operations related to comments
 * Uses TypeORM Repository pattern with parameterized queries for SQL injection prevention
 *
 * @Injectable - Marks this class as a provider that can be managed by NestJS dependency injection
 */
@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly repo: Repository<Comment>,
  ) {}

  /**
   * Create a new comment on a post
   */
  async create(
    postId: number,
    userId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const comment = this.repo.create({
      POST_ID: postId,
      USER_ID: userId,
      CONTENT: createCommentDto.CONTENT,
      IS_DELETED: 0,
    });

    return await this.repo.save(comment);
  }

  /**
   * Find all non-deleted comments for a specific post
   * Includes author information for display
   * Orders by creation date (oldest first to show conversation flow)
   */
  async findByPostId(postId: number): Promise<Comment[]> {
    return await this.repo.find({
      where: { POST_ID: postId, IS_DELETED: 0 },
      relations: ['USER'],
      order: { CREATED_AT: 'ASC' }, // Oldest first for conversation flow
      select: {
        COMMENT_ID: true,
        POST_ID: true,
        USER_ID: true,
        CONTENT: true,
        CREATED_AT: true,
        UPDATED_AT: true,
        IS_DELETED: true,
        USER: {
          USER_ID: true,
          EMAIL: true,
          FACE_IMAGE: true,
        },
      },
    });
  }

  /**
   * Find a single comment by ID
   */
  async findById(commentId: number): Promise<Comment | null> {
    return await this.repo.findOne({
      where: { COMMENT_ID: commentId, IS_DELETED: 0 },
      relations: ['USER', 'POST'],
    });
  }

  /**
   * Find a comment by ID and verify ownership
   */
  async findByIdAndUserId(
    commentId: number,
    userId: number,
  ): Promise<Comment | null> {
    return await this.repo.findOne({
      where: { COMMENT_ID: commentId, USER_ID: userId, IS_DELETED: 0 },
    });
  }

  /**
   * Soft delete a comment
   * Sets IS_DELETED flag to 1 instead of removing the record
   */
  async softDelete(commentId: number): Promise<boolean> {
    const result = await this.repo.update(
      { COMMENT_ID: commentId },
      { IS_DELETED: 1 },
    );
    return (result.affected ?? 0) > 0;
  }

  /**
   * Count total comments for a post (excluding deleted)
   */
  async countByPostId(postId: number): Promise<number> {
    return await this.repo.count({
      where: { POST_ID: postId, IS_DELETED: 0 },
    });
  }

  /**
   * Get recent comments by a user across all posts
   */
  async findRecentByUserId(
    userId: number,
    limit: number = 10,
  ): Promise<Comment[]> {
    return await this.repo.find({
      where: { USER_ID: userId, IS_DELETED: 0 },
      relations: ['POST', 'USER'],
      order: { CREATED_AT: 'DESC' },
      take: limit,
    });
  }

  /**
   * Soft delete all comments for a post
   */
  async softDeleteByPostId(postId: number): Promise<boolean> {
    const result = await this.repo.update(
      { POST_ID: postId, IS_DELETED: 0 },
      { IS_DELETED: 1 },
    );
    return (result.affected ?? 0) > 0;
  }
}
