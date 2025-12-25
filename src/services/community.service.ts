import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PostRepository } from '../repositories/post.repository';
import { CommentRepository } from '../repositories/comment.repository';
import { LikeRepository } from '../repositories/like.repository';
import { UserRepository } from '../repositories/user.repository';
import {
  CreatePostDto,
  UpdatePostDto,
  CreateCommentDto,
  PostResponseDto,
  CommentResponseDto,
  ToggleLikeResponseDto,
} from '../dtos/community.dto';

/**
 * Service layer for Community features (Posts, Comments, Likes)
 * Implements business logic and orchestrates repository operations
 */
@Injectable()
export class CommunityService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly commentRepository: CommentRepository,
    private readonly likeRepository: LikeRepository,
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * Create a new post
   */
  async createPost(
    userId: number,
    createPostDto: CreatePostDto,
  ): Promise<PostResponseDto> {
    // Validate user exists
    const user = await this.userRepository.findById(userId);
    if (!user || user.IS_DELETED === 1) {
      throw new BadRequestException('User not found or inactive');
    }

    // Create post
    const post = await this.postRepository.create(userId, createPostDto);

    // Return formatted response
    return {
      POST_ID: post.POST_ID,
      USER_ID: post.USER_ID,
      TITLE: post.TITLE,
      CONTENT: post.CONTENT,
      IMAGE_URL: post.IMAGE_URL,
      STATUS: post.STATUS,
      IS_DELETED: post.IS_DELETED,
      CREATED_AT: post.CREATED_AT ?? new Date(),
      UPDATED_AT: post.UPDATED_AT ?? new Date(),
      LIKE_COUNT: 0,
      COMMENT_COUNT: 0,
      IS_LIKED_BY_USER: false,
      USER: {
        USER_ID: user.USER_ID,
        EMAIL: user.EMAIL,
        FACE_IMAGE: user.FACE_IMAGE,
        FIRST_NAME: undefined,
        LAST_NAME: undefined,
      },
    };
  }

  /**
   * Get all posts with pagination and user-specific like status
   */
  async getAllPosts(
    page: number = 1,
    limit: number = 10,
    userId?: number,
    sortBy?: string,
    tags?: string,
    onlyUserPosts?: boolean,
  ): Promise<{
    posts: PostResponseDto[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    // 1. Get posts with filters
    const { posts, total } = await this.postRepository.findAllWithDetails(
      page,
      limit,
      userId,
      sortBy,
      tags,
      onlyUserPosts ? userId : undefined,
    );
    // 2. Logic check Like
    if (userId && posts.length > 0) {
      // FIX 1: Ép kiểu về Number khi lấy ID từ list posts để đảm bảo đầu vào chuẩn
      const postIds = posts.map((post) => Number(post.POST_ID));

      // Gọi repo
      const likedPostIds = await this.likeRepository.findLikedPostIds(
        userId,
        postIds,
      );

      // Tạo Set để tra cứu O(1) thay vì O(n) của .includes()
      // Đây là tối ưu hiệu năng nếu list posts lớn
      const likedSet = new Set(likedPostIds); // likedPostIds đã là number[]

      // Mark liked posts
      posts.forEach((post) => {
        // FIX 2: So sánh an toàn bằng cách ép kiểu post.POST_ID về number
        post.IS_LIKED_BY_USER = likedSet.has(Number(post.POST_ID));
      });
    } else {
      // Mặc định set false nếu không có user hoặc list rỗng
      posts.forEach((p) => (p.IS_LIKED_BY_USER = false));
    }

    const totalPages = Math.ceil(total / limit);

    return {
      posts,
      total,
      page,
      totalPages,
    };
  }

  /**
   * Get a single post by ID with details
   */
  async getPostById(postId: number, userId?: number): Promise<PostResponseDto> {
    const post = await this.postRepository.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Get counts
    const likeCount = await this.likeRepository.countByPostId(postId);
    const commentCount = await this.commentRepository.countByPostId(postId);

    // Check if user liked this post
    let isLikedByUser = false;
    if (userId) {
      isLikedByUser = await this.likeRepository.hasUserLikedPost(
        postId,
        userId,
      );
    }

    return {
      POST_ID: post.POST_ID,
      USER_ID: post.USER_ID,
      TITLE: post.TITLE,
      CONTENT: post.CONTENT,
      IMAGE_URL: post.IMAGE_URL,
      STATUS: post.STATUS,
      IS_DELETED: post.IS_DELETED,
      CREATED_AT: post.CREATED_AT ?? new Date(),
      UPDATED_AT: post.UPDATED_AT ?? new Date(),
      LIKE_COUNT: likeCount,
      COMMENT_COUNT: commentCount,
      IS_LIKED_BY_USER: isLikedByUser,
      USER: {
        USER_ID: post.USER.USER_ID,
        EMAIL: post.USER.EMAIL,
        FACE_IMAGE: post.USER.FACE_IMAGE,
        FIRST_NAME: undefined,
        LAST_NAME: undefined,
      },
    };
  }

  /**
   * Update an existing post
   */
  async updatePost(
    postId: number,
    userId: number,
    updatePostDto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    // Verify post exists and user owns it
    const post = await this.postRepository.findByIdAndUserId(postId, userId);

    if (!post) {
      throw new NotFoundException('Post not found or you do not own this post');
    }

    // Update post
    const updatedPost = await this.postRepository.update(postId, updatePostDto);

    if (!updatedPost) {
      throw new NotFoundException('Post not found after update');
    }

    // Get current counts
    const likeCount = await this.likeRepository.countByPostId(postId);
    const commentCount = await this.commentRepository.countByPostId(postId);
    const isLikedByUser = await this.likeRepository.hasUserLikedPost(
      postId,
      userId,
    );

    return {
      POST_ID: updatedPost.POST_ID,
      USER_ID: updatedPost.USER_ID,
      TITLE: updatedPost.TITLE,
      CONTENT: updatedPost.CONTENT,
      IMAGE_URL: updatedPost.IMAGE_URL,
      STATUS: updatedPost.STATUS,
      IS_DELETED: updatedPost.IS_DELETED,
      CREATED_AT: post.CREATED_AT ?? new Date(),
      UPDATED_AT: post.UPDATED_AT ?? new Date(),
      LIKE_COUNT: likeCount,
      COMMENT_COUNT: commentCount,
      IS_LIKED_BY_USER: isLikedByUser,
      USER: {
        USER_ID: updatedPost.USER.USER_ID,
        EMAIL: updatedPost.USER.EMAIL,
        FACE_IMAGE: updatedPost.USER.FACE_IMAGE,
        FIRST_NAME: undefined,
        LAST_NAME: undefined,
      },
    };
  }

  /**
   * Soft delete a post
   */
  async deletePost(
    postId: number,
    userId: number,
  ): Promise<{ message: string }> {
    // Verify post exists and user owns it
    const post = await this.postRepository.findByIdAndUserId(postId, userId);

    if (!post) {
      throw new NotFoundException('Post not found or you do not own this post');
    }

    // Soft delete post
    const deleted = await this.postRepository.softDelete(postId);

    if (!deleted) {
      throw new BadRequestException('Failed to delete post');
    }

    return { message: 'Post deleted successfully' };
  }

  /**
   * Toggle like on a post

   */
  async toggleLike(
    postId: number,
    userId: number,
  ): Promise<ToggleLikeResponseDto> {
    // Verify post exists
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if user already liked this post
    const existingLike = await this.likeRepository.findByPostIdAndUserId(
      postId,
      userId,
    );

    let action: 'liked' | 'unliked';

    if (existingLike) {
      // User already liked - remove like
      await this.likeRepository.delete(existingLike.LIKE_ID);
      action = 'unliked';
    } else {
      // User hasn't liked - add like
      await this.likeRepository.create(postId, userId);
      action = 'liked';
    }

    // Get updated like count
    const likeCount = await this.likeRepository.countByPostId(postId);

    return {
      IS_LIKED: action === 'liked',
      LIKE_COUNT: likeCount,
      ACTION: action,
    };
  }

  /**
   * Add a comment to a post
   */
  async createComment(
    postId: number,
    userId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    // Verify post exists
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Verify user exists
    const user = await this.userRepository.findById(userId);
    if (!user || user.IS_DELETED === 1) {
      throw new BadRequestException('User not found or inactive');
    }

    // Create comment
    const comment = await this.commentRepository.create(
      postId,
      userId,
      createCommentDto,
    );

    // Load user relation if not included
    const commentUser = comment.USER || user;

    return {
      COMMENT_ID: comment.COMMENT_ID,
      POST_ID: comment.POST_ID,
      USER_ID: comment.USER_ID,
      CONTENT: comment.CONTENT,
      IS_DELETED: comment.IS_DELETED,
      CREATED_AT: comment.CREATED_AT ?? new Date(),
      UPDATED_AT: comment.UPDATED_AT ?? new Date(),
      USER: {
        USER_ID: commentUser.USER_ID,
        EMAIL: commentUser.EMAIL,
        FACE_IMAGE: commentUser.FACE_IMAGE,
        FIRST_NAME: undefined,
        LAST_NAME: undefined,
      },
    };
  }

  /**
   * Get all comments for a post
   */
  async getCommentsByPostId(postId: number): Promise<CommentResponseDto[]> {
    // Verify post exists
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Get comments
    const comments = await this.commentRepository.findByPostId(postId);

    // Format response
    return comments.map((comment) => ({
      COMMENT_ID: comment.COMMENT_ID,
      POST_ID: comment.POST_ID,
      USER_ID: comment.USER_ID,
      CONTENT: comment.CONTENT,
      IS_DELETED: comment.IS_DELETED,
      CREATED_AT: comment.CREATED_AT ?? new Date(),
      UPDATED_AT: comment.UPDATED_AT ?? new Date(),
      USER: {
        USER_ID: comment.USER.USER_ID,
        EMAIL: comment.USER.EMAIL,
        FACE_IMAGE: comment.USER.FACE_IMAGE,
        FIRST_NAME: undefined,
        LAST_NAME: undefined,
      },
    }));
  }

  /**
   * Delete a comment
   */
  async deleteComment(
    commentId: number,
    userId: number,
  ): Promise<{ message: string }> {
    // Verify comment exists and user owns it
    const comment = await this.commentRepository.findByIdAndUserId(
      commentId,
      userId,
    );

    if (!comment) {
      throw new NotFoundException(
        'Comment not found or you do not own this comment',
      );
    }

    // Soft delete comment
    const deleted = await this.commentRepository.softDelete(commentId);

    if (!deleted) {
      throw new BadRequestException('Failed to delete comment');
    }

    return { message: 'Comment deleted successfully' };
  }
}
