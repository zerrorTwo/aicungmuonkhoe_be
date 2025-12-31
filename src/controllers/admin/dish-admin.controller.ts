import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/decoractors/current-user.decorator';
import { User } from 'src/entities/user.entity';
import { DishService } from 'src/services/dish.service';
import { AdminGuard } from 'src/utils/auth/admin.guard';

@Controller('dish')
@UseGuards(AdminGuard)
export class DishAdminController {
  constructor(private readonly dishService: DishService) {}

  @Get()
  async getAdminDishes(@Query() query: any) {
    return this.dishService.getAdminDishes(query);
  }

  @Post()
  @UseInterceptors(FileInterceptor('SMALL_IMAGE'))
  async createDish(
    @Body() data: any,
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const url = await this.dishService.uploadImage(file);
      data.SMALL_IMAGE = url;
    }
    return this.dishService.createDish(data, user);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('SMALL_IMAGE'))
  async updateDish(
    @Param('id') id: string,
    @Body() data: any,
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const url = await this.dishService.uploadImage(file);
      data.SMALL_IMAGE = url;
    }
    return this.dishService.updateDish(id, data, user);
  }

  @Delete(':id')
  async deleteDish(@Param('id') id: string) {
    return this.dishService.deleteDish(id);
  }

  @Get('ages')
  async getDishAges() {
    return this.dishService.getDishAges();
  }

  @Get('regions')
  async getDishRegions() {
    return this.dishService.getDishRegions();
  }

  @Get('cooking-methods')
  async getDishCookingMethods() {
    return this.dishService.getDishCookingMethods();
  }

  @Get('meal-structures')
  async getDishMealStructures() {
    return this.dishService.getDishMealStructures();
  }
}
