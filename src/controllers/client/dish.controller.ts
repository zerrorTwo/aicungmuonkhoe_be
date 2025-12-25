import { Controller, Get, Param, Query } from '@nestjs/common';
import { DishService } from 'src/services/dish.service';
import { DishBasicResponseDto, DishDetailResponseDto } from 'src/dtos/dish.dto';

@Controller('/dishes')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  /**
   * Get dishes by age
   * GET /api/dishes/by-age?age=25
   */
  @Get('by-age')
  async getDishesByAge(
    @Query('age') age: string,
  ): Promise<{ success: boolean; data: DishBasicResponseDto[] }> {
    const ageInYears = parseInt(age, 10);
    const dishes = await this.dishService.getDishesByAge(ageInYears);
    return {
      success: true,
      data: dishes,
    };
  }

  /**
   * Get dish detail
   * GET /api/dishes/:id/detail?ageGroupId=DT13
   */
  @Get(':id/detail')
  async getDishDetail(
    @Param('id') id: string,
    @Query('ageGroupId') ageGroupId: string,
  ): Promise<{ success: boolean; data: DishDetailResponseDto }> {
    const dish = await this.dishService.getDishDetail(id, ageGroupId);
    return {
      success: true,
      data: dish,
    };
  }
}
