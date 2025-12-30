import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  HttpException,
  HttpStatus,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FoodService } from '../../services/food.service';
import { AdminGuard } from '../../utils/auth/admin.guard';
import { User } from '../../entities/user.entity';
import { CurrentUser } from '../../decoractors/current-user.decorator';

@Controller('foods')
@UseGuards(AdminGuard)
export class FoodAdminController {
  constructor(private readonly foodService: FoodService) {}
  private readonly logger = new Logger(FoodAdminController.name);

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createFood(
    @Body() data: any,
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const url = await this.foodService.uploadImage(file);
      data.IMAGE = url;
    }
    return this.foodService.createFood(data, user);
  }

  @Get()
  async getFoodList(@Query() query: any) {
    return this.foodService.getFoodList(query);
  }

  @Get('groups')
  async getFoodGroupList() {
    return this.foodService.getFoodGroupList();
  }

  @Get('classifications')
  async getFoodClassificationList() {
    return this.foodService.getFoodClassificationList();
  }

  @Get(':id')
  async getFoodDetail(@Param('id') id: string) {
    return this.foodService.getFoodDetail(Number(id));
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateFood(
    @Param('id') id: string,
    @Body() data: any,
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const url = await this.foodService.uploadImage(file);
      data.IMAGE = url;
    }
    return this.foodService.updateFood(Number(id), data, user);
  }

  @Delete(':id')
  async deleteFood(@Param('id') id: string) {
    return this.foodService.deleteFood(Number(id));
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importFood(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }

    return this.foodService.importFood(file, user, this.logger);
  }
}
