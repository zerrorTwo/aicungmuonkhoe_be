import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Builder } from 'builder-pattern';
import { StatusCodes } from 'http-status-codes';
import { CurrentUser } from 'src/decoractors/current-user.decorator';
import {
  BannerQueryDto,
  CreateBannerDto,
  UpdateBannerDto,
} from 'src/dtos/banner.dto';
import { BannerEntity } from 'src/entities/banner.entity';
import { User } from 'src/entities/user.entity';
import {
  DataPagination,
  SuccessResponse,
} from 'src/interfaces/response.interface';
import { BannerService } from 'src/services/banner.service';
import { SuccessMessages } from 'src/utils/constants/message.constants';

import { AdminGuard } from 'src/utils/auth/admin.guard';

@Controller('banners')
@UseGuards(AdminGuard)
export class BannerAdminController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  @UseInterceptors(FileInterceptor('IMAGE'))
  async create(
    @Body() dto: CreateBannerDto,
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const banner = await this.bannerService.create(dto, user.USER_ID, file);
      return Builder<SuccessResponse<BannerEntity>>()
        .data(banner)
        .message(SuccessMessages.CREATE_SUCCESSFULLY)
        .status(StatusCodes.CREATED)
        .build();
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create banner',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(@Query() query: BannerQueryDto) {
    try {
      const { banners, total } = await this.bannerService.findAll(query);

      const page = query.page || 1;
      const limit = query.limit || 10;

      const response: DataPagination<BannerEntity> = {
        listData: banners,
        paging: {
          page,
          limit,
          total,
        },
        message: SuccessMessages.GET_SUCCESSFULLY,
        status: StatusCodes.OK,
      };
      return response;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get banners',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const banner = await this.bannerService.findById(id);
      if (!banner) {
        throw new HttpException('Banner not found', HttpStatus.NOT_FOUND);
      }
      return Builder<SuccessResponse<BannerEntity>>()
        .data(banner)
        .message(SuccessMessages.GET_SUCCESSFULLY)
        .status(StatusCodes.OK)
        .build();
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get banner',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('IMAGE'))
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateBannerDto,
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const banner = await this.bannerService.findById(id);
      if (!banner) {
        throw new HttpException('Banner not found', HttpStatus.NOT_FOUND);
      }

      const updatedBanner = await this.bannerService.update(
        id,
        dto,
        user.USER_ID,
        file,
      );
      return Builder<SuccessResponse<BannerEntity>>()
        .data(updatedBanner!)
        .message(SuccessMessages.UPDATE_SUCCESSFULLY)
        .status(StatusCodes.OK)
        .build();
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update banner',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      const banner = await this.bannerService.findById(id);
      if (!banner) {
        throw new HttpException('Banner not found', HttpStatus.NOT_FOUND);
      }

      await this.bannerService.delete(id);
      return Builder<SuccessResponse<boolean>>()
        .data(true)
        .message(SuccessMessages.DELETE_SUCCESSFULLY)
        .status(StatusCodes.OK)
        .build();
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete banner',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
