import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Like } from '../entities/like.entity';

/**
 * Repository for Like entity
 * Handles all database operations related to post likes
 * Uses TypeORM Repository pattern with parameterized queries for SQL injection prevention
 *
 * @Injectable - Marks this class as a provider that can be managed by NestJS dependency injection
 */
@Injectable()
export class LikeRepository {
  constructor(
    @InjectRepository(Like)
    private readonly repo: Repository<Like>,
  ) {}

  async create(postId: number, userId: number): Promise<Like> {
    const like = this.repo.create({
      POST_ID: postId,
      USER_ID: userId,
    });

    return await this.repo.save(like);
  }

  async findByPostIdAndUserId(
    postId: number,
    userId: number,
  ): Promise<Like | null> {
    return await this.repo.findOne({
      where: { POST_ID: postId, USER_ID: userId },
    });
  }

  async delete(likeId: number): Promise<boolean> {
    const result = await this.repo.delete({ LIKE_ID: likeId });
    return (result.affected ?? 0) > 0;
  }

  async deleteByPostIdAndUserId(
    postId: number,
    userId: number,
  ): Promise<boolean> {
    const result = await this.repo.delete({ POST_ID: postId, USER_ID: userId });
    return (result.affected ?? 0) > 0;
  }

  async countByPostId(postId: number): Promise<number> {
    return await this.repo.count({
      where: { POST_ID: postId },
    });
  }

  async hasUserLikedPost(postId: number, userId: number): Promise<boolean> {
    const like = await this.findByPostIdAndUserId(postId, userId);
    return like !== null;
  }

  async findUsersByPostId(postId: number, limit?: number): Promise<Like[]> {
    const queryBuilder = this.repo
      .createQueryBuilder('like')
      .leftJoinAndSelect('like.USER', 'user')
      .where('like.POST_ID = :postId', { postId })
      .orderBy('like.CREATED_AT', 'DESC');

    if (limit) {
      queryBuilder.take(limit);
    }

    return await queryBuilder.getMany();
  }

  async findPostsByUserId(userId: number, limit: number = 20): Promise<Like[]> {
    return await this.repo.find({
      where: { USER_ID: userId },
      relations: ['POST', 'POST.USER'],
      order: { CREATED_AT: 'DESC' },
      take: limit,
    });
  }

  async findLikedPostIds(userId: number, postIds: number[]): Promise<number[]> {
    // Guard clause: Nếu không có ID nào để check thì return luôn, đỡ tốn 1 query DB
    if (!postIds || postIds.length === 0) {
      return [];
    }

    const likes = await this.repo.find({
      where: {
        USER_ID: userId,
        POST_ID: In(postIds), // TypeORM In operator
      },
      select: ['POST_ID'],
    });

    // Đảm bảo trả về number[]
    return likes.map((like) => Number(like.POST_ID));
  }

  async deleteByPostId(postId: number): Promise<boolean> {
    const result = await this.repo.delete({ POST_ID: postId });
    return (result.affected ?? 0) > 0;
  }
}
