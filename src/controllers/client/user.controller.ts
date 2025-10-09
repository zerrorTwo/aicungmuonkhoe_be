import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Param,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { StatusCodes } from 'http-status-codes';
import { CreateNewUserDto, UpdateSecuritySetting, UpdateUserProfileDto } from 'src/dtos/user.dto';
import { UserService } from 'src/services/user.service';
import { AuthGuard } from 'src/utils/auth/auth.guard';
import { SuccessMessages } from 'src/utils/constants/message.constants';
import { SuccessResponse } from 'src/utils/format';
import { User } from '../../entities/user.entity';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new user (face recognition login)' })
  @ApiResponse({ status: 200, description: 'Successfully created user' })
  @ApiResponse({
    status: 401,
    description: 'User not found or unauthorized',
  })
  async createNew(@Body() createDto: CreateNewUserDto) {
    const result = await this.userService.createEmployee(createDto);

    return Builder<SuccessResponse<User>>()
      .data(result)
      .message(SuccessMessages.CREATE_SUCCESSFULLY)
      .status(StatusCodes.OK)
      .build();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get user information by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user information',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: number) {
    const result = await this.userService.findUserByID(id);

    if (!result) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return Builder<SuccessResponse<User>>()
      .data(result)
      .message(SuccessMessages.GET_SUCCESSFULLY)
      .status(StatusCodes.OK)
      .build();
  }

  @Get('/profile/me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get current user profile with health document info' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user profile',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getCurrentUserProfile(@Req() req) {
      const userId = req.user.user_id;


      if (!userId) {
        throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
      }

      const profile = await this.userService.getUserProfile(userId);


      return Builder<SuccessResponse<any>>()
        .data(profile)
        .message(SuccessMessages.GET_SUCCESSFULLY)
        .status(StatusCodes.OK)
        .build();
        
  }

  @Put('/profile/me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update current user profile (JSON only)' })
  @ApiConsumes('application/json')
  @ApiResponse({
    status: 200,
    description: 'Successfully updated user profile',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  async updateCurrentUserProfile(
    @Req() req, 
    @Body() updateData: UpdateUserProfileDto
  ) {
      const userId = req.user.user_id;

      if (!userId) {
        throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
      }

      // Delegate to service
      const updatedProfile = await this.userService.updateUserProfile(userId, updateData);
        
      return Builder<SuccessResponse<any>>()
        .data(updatedProfile)
        .message('Profile updated successfully')
        .status(StatusCodes.OK)
        .build();
  }

  @Put('/profile/me/avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({ summary: 'Upload user avatar only' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Successfully updated user avatar',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid file' })
  async updateUserAvatar(
    @Req() req,
    @UploadedFile() avatarFile: Express.Multer.File
  ) {
      const userId = req.user.user_id;

      if (!userId) {
        throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
      }

      if (!avatarFile) {
        throw new HttpException('No avatar file provided', HttpStatus.BAD_REQUEST);
      }

      // Delegate validation and processing to service
      const updatedProfile = await this.userService.updateUserAvatar(userId, avatarFile);

      return Builder<SuccessResponse<any>>()
        .data(updatedProfile)
        .message('Avatar updated successfully')
        .status(StatusCodes.OK)
        .build();
  }

  @Put('/security/me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update current user security settings (JSON only)' })
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, description: 'Security settings updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Current password is incorrect' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid OTP or validation error' })
  async securitySetting(@Req() req : any, @Body() data: UpdateSecuritySetting) 
  {
    const userId = req.user.user_id;
    console.log("userId: ", userId);
    if (!userId) {
      throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    }
    
    // Delegate to service
    const updatedSecuritySettings = await this.userService.updateUserSecuritySettings(userId, data);

    return Builder<SuccessResponse<any>>()
      .data(updatedSecuritySettings)
      .message('Security settings updated successfully')
      .status(StatusCodes.OK)
      .build();
  }
}