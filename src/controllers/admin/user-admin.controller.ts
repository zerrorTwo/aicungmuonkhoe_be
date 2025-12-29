import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { UserRepository } from 'src/repositories/user.repository';
import { AdminUserQueryDto, AdminUpdateUserDto } from 'src/dtos/user.dto';
import { AdminGuard } from 'src/utils/auth/admin.guard';

@Controller('users')
@UseGuards(AdminGuard)
export class UserAdminController {
  constructor(private readonly userRepository: UserRepository) {}

  @Get()
  async getUsers(@Query() query: AdminUserQueryDto) {
    try {
      const { users, total } = await this.userRepository.findAllWithPagination({
        page: query.page,
        limit: query.limit,
        search: query.search,
        status: query.status,
        isAdmin: query.isAdmin,
      });

      const page = query.page || 1;
      const limit = query.limit || 10;

      return {
        success: true,
        data: {
          users,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('stats/overview')
  async getUserStats() {
    try {
      const stats = await this.userRepository.getUserStats();

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get statistics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getUserDetail(@Param('id') id: string) {
    try {
      const user = await this.userRepository.findUserWithHealthDocuments(
        parseInt(id),
      );

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get user',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() data: AdminUpdateUserDto) {
    try {
      const user = await this.userRepository.findById(parseInt(id));

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      await this.userRepository.update(parseInt(id), data);

      return {
        success: true,
        message: 'User updated successfully',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update user',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      const user = await this.userRepository.findById(parseInt(id));

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      await this.userRepository.softDelete(parseInt(id));

      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete user',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
