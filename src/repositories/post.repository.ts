import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto, UpdatePostDto } from '../dtos/community.dto';

/**
 * Repository for Post entity
 * Handles all database operations related to posts
 * Uses TypeORM Repository pattern with parameterized queries for SQL injection prevention
 *
 * @Injectable - Marks this class as a provider that can be managed by NestJS dependency injection
 */
@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repo: Repository<Post>,
  ) {}

  /**
   * Create a new post in the database
   */
  async create(userId: number, createPostDto: CreatePostDto): Promise<Post> {
    const post = this.repo.create({
      USER_ID: userId,
      TITLE: createPostDto.TITLE,
      CONTENT: createPostDto.CONTENT,
      IMAGE_URL: createPostDto.IMAGE_URL,
      STATUS: 1, // Published by default
      IS_DELETED: 0,
    });

    return await this.repo.save(post);
  }

  /**
   * Find all non-deleted posts with author info, like count, and comment count
   * Orders by creation date (newest first) or by specified sort option
   * Implements pagination and filtering for better performance
   */
  async findAllWithDetails(
    page: number = 1,
    limit: number = 10,
    userId?: number,
    sortBy?: string,
    tags?: string,
    filterUserId?: number,
  ): Promise<{ posts: any[]; total: number }> {
    const skip = (page - 1) * limit;

    // Build query with aggregations and user info
    const queryBuilder = this.repo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.USER', 'user')
      .leftJoin('post.LIKES', 'likes')
      .leftJoin('post.COMMENTS', 'comments', 'comments.IS_DELETED = 0')
      .where('post.IS_DELETED = :isDeleted', { isDeleted: 0 });

    // Filter by specific user if provided
    if (filterUserId) {
      queryBuilder.andWhere('post.USER_ID = :filterUserId', { filterUserId });
    }

    // TODO: Filter by tags (requires TAGS column in database)
    // if (tags) {
    //   const tagArray = tags.split(',').map(t => t.trim());
    //   queryBuilder.andWhere('post.TAGS IN (:...tagArray)', { tagArray });
    // }

    queryBuilder
      .select([
        'post.POST_ID',
        'post.USER_ID',
        'post.TITLE',
        'post.CONTENT',
        'post.IMAGE_URL',
        'post.STATUS',
        'post.CREATED_AT',
        'post.UPDATED_AT',
        'user.USER_ID',
        'user.EMAIL',
        'user.FACE_IMAGE',
      ])
      .addSelect('COUNT(DISTINCT likes.LIKE_ID)', 'LIKE_COUNT')
      .addSelect('COUNT(DISTINCT comments.COMMENT_ID)', 'COMMENT_COUNT')
      .groupBy('post.POST_ID')
      .addGroupBy('user.USER_ID');

    // Apply sorting based on sortBy parameter
    switch (sortBy) {
      case 'mostLiked':
        queryBuilder.orderBy('LIKE_COUNT', 'DESC');
        break;
      case 'mostCommented':
        queryBuilder.orderBy('COMMENT_COUNT', 'DESC');
        break;
      case 'popular':
        // Popular = combination of likes + comments
        queryBuilder.orderBy('LIKE_COUNT + COMMENT_COUNT', 'DESC');
        break;
      case 'newest':
      default:
        queryBuilder.orderBy('post.CREATED_AT', 'DESC');
        break;
    }

    queryBuilder.skip(skip).take(limit);

    // Get posts with counts
    const posts = await queryBuilder.getRawAndEntities();

    // Get total count for pagination with same filters
    const countQueryBuilder = this.repo
      .createQueryBuilder('post')
      .where('post.IS_DELETED = :isDeleted', { isDeleted: 0 });

    if (filterUserId) {
      countQueryBuilder.andWhere('post.USER_ID = :filterUserId', {
        filterUserId,
      });
    }

    const total = await countQueryBuilder.getCount();

    // Format response with like/comment counts
    const formattedPosts = posts.entities.map((post, index) => {
      const raw = posts.raw[index];
      return {
        ...post,
        LIKE_COUNT: parseInt(raw.LIKE_COUNT) || 0,
        COMMENT_COUNT: parseInt(raw.COMMENT_COUNT) || 0,
        IS_LIKED_BY_USER: false, // Will be updated by service if userId provided
      };
    });

    return { posts: formattedPosts, total };
  }

  /**
   * Find a single post by ID with full details
   */
  async findById(postId: number): Promise<Post | null> {
    return await this.repo.findOne({
      where: { POST_ID: postId, IS_DELETED: 0 },
      relations: ['USER'],
    });
  }

  /**
   * Find a post by ID and verify ownership
   * Used before update/delete operations to ensure user owns the post
   */
  async findByIdAndUserId(
    postId: number,
    userId: number,
  ): Promise<Post | null> {
    return await this.repo.findOne({
      where: { POST_ID: postId, USER_ID: userId, IS_DELETED: 0 },
    });
  }

  /**
   * Update an existing post
   * Only updates fields that are provided in the DTO
   */
  async update(
    postId: number,
    updatePostDto: UpdatePostDto,
  ): Promise<Post | null> {
    await this.repo.update({ POST_ID: postId }, updatePostDto);
    return await this.findById(postId);
  }

  /**
   * Soft delete a post
   * Sets IS_DELETED flag to 1 instead of removing the record
   */
  async softDelete(postId: number): Promise<boolean> {
    const result = await this.repo.update(
      { POST_ID: postId },
      { IS_DELETED: 1 },
    );
    return (result.affected ?? 0) > 0;
  }

  /**
   * Get posts created by a specific user
   */
  async findByUserId(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ posts: Post[]; total: number }> {
    const skip = (page - 1) * limit;

    const [posts, total] = await this.repo.findAndCount({
      where: { USER_ID: userId, IS_DELETED: 0 },
      relations: ['USER'],
      order: { CREATED_AT: 'DESC' },
      skip,
      take: limit,
    });

    return { posts, total };
  }
}
