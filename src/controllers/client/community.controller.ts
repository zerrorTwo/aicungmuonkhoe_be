import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { StatusCodes } from 'http-status-codes';
import { CommunityService } from '../../services/community.service';
import { CloudinaryProvider } from '../../providers/cloudinary.provider';
import {
  CreatePostDto,
  UpdatePostDto,
  CreateCommentDto,
  PostResponseDto,
  CommentResponseDto,
  ToggleLikeResponseDto,
  PaginationDto,
} from '../../dtos/community.dto';
import { SuccessResponse } from '../../utils/format';
import { SuccessMessages } from '../../utils/constants/message.constants';
import { AuthGuard } from 'src/utils/auth/auth.guard';

/**
 * Controller for Community features (Posts, Comments, Likes)
 */
@ApiTags('Community')
@Controller('community')
export class CommunityController {
  constructor(
    private readonly communityService: CommunityService,
    private readonly cloudinaryProvider: CloudinaryProvider,
  ) {}

  /**
   * Upload image to Cloudinary
   * POST /community/upload-image
   */
  @Post('upload-image')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload image to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Image uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        data: {
          type: 'object',
          properties: {
            url: { type: 'string', example: 'https://res.cloudinary.com/...' },
          },
        },
        message: { type: 'string', example: 'Image uploaded successfully' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - No file provided' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return Builder<SuccessResponse<null>>()
        .data(null)
        .message('No file provided')
        .status(StatusCodes.BAD_REQUEST)
        .build();
    }

    const result = await this.cloudinaryProvider.uploadStream(
      file,
      'community-posts',
    );

    return Builder<SuccessResponse<{ url: string }>>()
      .data({ url: result.secure_url })
      .message('Image uploaded successfully')
      .status(StatusCodes.OK)
      .build();
  }

  /**
   * Create a new post
   * POST /community/posts
   */
  @Post('posts')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  async createPost(@Body() createPostDto: CreatePostDto, @Request() req: any) {
    const userId = req.user.user_id;
    const post = await this.communityService.createPost(userId, createPostDto);

    return Builder<SuccessResponse<PostResponseDto>>()
      .data(post)
      .message('Post created successfully')
      .status(StatusCodes.CREATED)
      .build();
  }

  /**
   * Get all posts with pagination
   * GET /community/posts?page=1&limit=10
   */
  @Get('posts')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all posts with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Posts per page (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Posts retrieved successfully',
  })
  async getAllPosts(
    @Query() paginationDto: PaginationDto,
    @Request() req: any,
  ) {
    const userId = req.user.user_id;
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;
    const sortBy = paginationDto.sortBy;
    const tags = paginationDto.tags;
    const onlyUserPosts = paginationDto.myPosts;

    const result = await this.communityService.getAllPosts(
      page,
      limit,
      userId,
      sortBy,
      tags,
      onlyUserPosts,
    );

    return Builder<
      SuccessResponse<{
        posts: PostResponseDto[];
        total: number;
        page: number;
        totalPages: number;
      }>
    >()
      .data(result)
      .message('Posts retrieved successfully')
      .status(StatusCodes.OK)
      .build();
  }

  /**
   * Get a single post by ID
   * GET /community/posts/:id
   */
  @Get('posts/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a single post by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Post retrieved successfully',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getPostById(@Param('id') id: number, @Request() req: any) {
    const userId = req.user?.userId || req.user?.USER_ID;
    const post = await this.communityService.getPostById(id, userId);

    return Builder<SuccessResponse<PostResponseDto>>()
      .data(post)
      .message('Post retrieved successfully')
      .status(StatusCodes.OK)
      .build();
  }

  /**
   * Update an existing post
   * PUT /community/posts/:id
   */
  @Put('posts/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a post' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Not post owner' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async updatePost(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: any,
  ) {
    const userId = req.user?.userId || req.user?.USER_ID;
    const post = await this.communityService.updatePost(
      id,
      userId,
      updatePostDto,
    );

    return Builder<SuccessResponse<PostResponseDto>>()
      .data(post)
      .message('Post updated successfully')
      .status(StatusCodes.OK)
      .build();
  }

  /**
   * Soft delete a post
   * DELETE /community/posts/:id
   */
  @Delete('posts/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a post (soft delete)' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not post owner' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async deletePost(@Param('id') id: number, @Request() req: any) {
    const userId = req.user?.userId || req.user?.USER_ID;
    const result = await this.communityService.deletePost(id, userId);

    return Builder<SuccessResponse<null>>()
      .data(null)
      .message(result.message)
      .status(StatusCodes.OK)
      .build();
  }

  /**
   * Toggle like on a post
   * POST /community/posts/:id/like
   */
  @Post('posts/:id/like')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle like on a post' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Like toggled successfully',
    type: ToggleLikeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async toggleLike(@Param('id') id: number, @Request() req: any) {
    const userId = req.user.user_id;
    const result = await this.communityService.toggleLike(id, userId);

    return Builder<SuccessResponse<ToggleLikeResponseDto>>()
      .data(result)
      .message(`Post ${result.ACTION} successfully`)
      .status(StatusCodes.OK)
      .build();
  }

  /**
   * Create a comment on a post
   * POST /community/posts/:id/comments
   */
  @Post('posts/:id/comments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a comment on a post' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
    type: CommentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async createComment(
    @Param('id') id: number,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: any,
  ) {
    const userId = req.user?.userId || req.user?.USER_ID;
    const comment = await this.communityService.createComment(
      id,
      userId,
      createCommentDto,
    );

    return Builder<SuccessResponse<CommentResponseDto>>()
      .data(comment)
      .message('Comment created successfully')
      .status(StatusCodes.CREATED)
      .build();
  }

  /**
   * Get all comments for a post
   * GET /community/posts/:id/comments
   */
  @Get('posts/:id/comments')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all comments for a post' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Comments retrieved successfully',
    type: [CommentResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getCommentsByPostId(@Param('id') id: number) {
    const comments = await this.communityService.getCommentsByPostId(id);

    return Builder<SuccessResponse<CommentResponseDto[]>>()
      .data(comments)
      .message('Comments retrieved successfully')
      .status(StatusCodes.OK)
      .build();
  }

  /**
   * Delete a comment
   * DELETE /community/comments/:id
   */
  @Delete('comments/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a comment (soft delete)' })
  @ApiParam({ name: 'id', type: Number, description: 'Comment ID' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not comment owner' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async deleteComment(@Param('id') id: number, @Request() req: any) {
    const userId = req.user?.userId || req.user?.USER_ID;
    const result = await this.communityService.deleteComment(id, userId);

    return Builder<SuccessResponse<null>>()
      .data(null)
      .message(result.message)
      .status(StatusCodes.OK)
      .build();
  }
}
