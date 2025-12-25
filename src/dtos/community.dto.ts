import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  IsPositive,
  MaxLength,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

/**
 * DTO for creating a new post
 * Validates incoming request data for post creation
 */
export class CreatePostDto {
  /**
   * Post title - Brief summary or headline
   * Required field, max 500 characters
   */
  @ApiProperty({
    description: 'Title of the post',
    example: 'My Health Journey: 30 Days of Healthy Eating',
    maxLength: 500,
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @MaxLength(500, { message: 'Title cannot exceed 500 characters' })
  TITLE: string;

  /**
   * Post content - Main body text
   * Required field
   */
  @ApiProperty({
    description: 'Content of the post',
    example:
      'Today marks 30 days of following a balanced diet. Here are my results...',
  })
  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  CONTENT: string;

  /**
   * Image URL - Optional image attachment
   * Can be a URL to uploaded image or external link
   */
  @ApiProperty({
    description: 'URL of the post image (optional)',
    example: 'https://example.com/images/my-journey.jpg',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Image URL must be a string' })
  IMAGE_URL?: string;
}

/**
 * DTO for updating an existing post
 * All fields are optional to allow partial updates
 */
export class UpdatePostDto {
  /**
   * Post title - Optional update
   */
  @ApiProperty({
    description: 'Title of the post',
    example: 'Updated: My Health Journey',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MaxLength(500, { message: 'Title cannot exceed 500 characters' })
  TITLE?: string;

  /**
   * Post content - Optional update
   */
  @ApiProperty({
    description: 'Content of the post',
    example: 'Updated content with more details...',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Content must be a string' })
  CONTENT?: string;

  /**
   * Image URL - Optional update
   */
  @ApiProperty({
    description: 'URL of the post image',
    example: 'https://example.com/images/updated-image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Image URL must be a string' })
  IMAGE_URL?: string;
}

/**
 * Response DTO for post data with aggregated counts
 * Includes like count, comment count, and author information
 */
export class PostResponseDto {
  @ApiProperty({ description: 'Unique post identifier' })
  POST_ID: number;

  @ApiProperty({ description: 'Post author user ID' })
  USER_ID: number;

  @ApiProperty({ description: 'Post title' })
  TITLE: string;

  @ApiProperty({ description: 'Post content' })
  CONTENT: string;

  @ApiProperty({ description: 'Post image URL', required: false })
  IMAGE_URL?: string;

  @ApiProperty({ description: 'Post status' })
  STATUS: number;

  @ApiProperty({ description: 'Soft delete flag' })
  IS_DELETED: number;

  @ApiProperty({ description: 'Post creation timestamp' })
  CREATED_AT: Date;

  @ApiProperty({ description: 'Post last update timestamp' })
  UPDATED_AT: Date;

  @ApiProperty({ description: 'Total number of likes on this post' })
  LIKE_COUNT: number;

  @ApiProperty({ description: 'Total number of comments on this post' })
  COMMENT_COUNT: number;

  @ApiProperty({ description: 'Whether current user has liked this post' })
  IS_LIKED_BY_USER: boolean;

  @ApiProperty({ description: 'Post author information' })
  USER: {
    USER_ID: number;
    EMAIL: string;
    FACE_IMAGE?: string;
    FIRST_NAME?: string;
    LAST_NAME?: string;
  };
}

/**
 * DTO for creating a comment on a post
 */
export class CreateCommentDto {
  /**
   * Comment content - Required text content
   */
  @ApiProperty({
    description: 'Content of the comment',
    example: 'Great post! Very inspiring!',
  })
  @IsNotEmpty({ message: 'Comment content is required' })
  @IsString({ message: 'Content must be a string' })
  CONTENT: string;
}

/**
 * Response DTO for comment data with author information
 */
export class CommentResponseDto {
  @ApiProperty({ description: 'Unique comment identifier' })
  COMMENT_ID: number;

  @ApiProperty({ description: 'Post ID this comment belongs to' })
  POST_ID: number;

  @ApiProperty({ description: 'Comment author user ID' })
  USER_ID: number;

  @ApiProperty({ description: 'Comment content' })
  CONTENT: string;

  @ApiProperty({ description: 'Soft delete flag' })
  IS_DELETED: number;

  @ApiProperty({ description: 'Comment creation timestamp' })
  CREATED_AT: Date;

  @ApiProperty({ description: 'Comment last update timestamp' })
  UPDATED_AT: Date;

  @ApiProperty({ description: 'Comment author information' })
  USER: {
    USER_ID: number;
    EMAIL: string;
    FACE_IMAGE?: string;
    FIRST_NAME?: string;
    LAST_NAME?: string;
  };
}

/**
 * Response DTO for like toggle action
 * Indicates whether the like was added or removed
 */
export class ToggleLikeResponseDto {
  @ApiProperty({
    description: 'Whether the post is now liked by the user',
    example: true,
  })
  IS_LIKED: boolean;

  @ApiProperty({
    description: 'Total like count after the toggle',
    example: 15,
  })
  LIKE_COUNT: number;

  @ApiProperty({
    description: 'Action performed',
    example: 'liked',
    enum: ['liked', 'unliked'],
  })
  ACTION: 'liked' | 'unliked';
}

/**
 * Query parameters for pagination
 */
export class PaginationDto {
  @ApiProperty({
    description: 'Page number (starting from 1)',
    example: 1,
    required: false,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number) // TRANSFORM
  @IsInt({ message: 'Page must be an integer' })
  @IsPositive({ message: 'Page must be a positive number' })
  page: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    required: false,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number) // TRANSFORM
  @IsInt({ message: 'Limit must be an integer' })
  @IsPositive({ message: 'Limit must be a positive number' })
  limit: number = 10;

  @ApiProperty({
    description: 'Sort by field',
    example: 'newest',
    required: false,
    enum: ['newest', 'popular', 'mostLiked', 'mostCommented'],
  })
  @IsOptional()
  @IsEnum(['newest', 'popular', 'mostLiked', 'mostCommented'], {
    message: 'Invalid sort option',
  })
  sortBy?: string;

  @ApiProperty({
    description: 'Filter by tags (comma separated)',
    example: 'nutrition,exercise',
    required: false,
  })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiProperty({
    description: 'Show only my posts',
    example: false,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  myPosts?: boolean;
}
