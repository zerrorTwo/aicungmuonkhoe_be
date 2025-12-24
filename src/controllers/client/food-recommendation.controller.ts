import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FoodRecommendationService } from '../../services/food-recommendation.service';
import { AuthGuard } from '../../utils/auth/auth.guard';
import { GetFoodRecommendationDto } from '../../dtos/food-recommendation.dto';
import { SuccessResponse } from '../../utils/format';
import { Builder } from 'builder-pattern';
import { StatusCodes } from 'http-status-codes';

@ApiTags('Food Recommendations')
@Controller('food-recommendations')
@UseGuards(AuthGuard)
export class FoodRecommendationController {
  constructor(
    private readonly foodRecommendationService: FoodRecommendationService,
  ) {}

  @Post('get')
  @ApiOperation({
    summary: 'Get food recommendations based on health document',
    description:
      'Returns paginated list of foods recommended to eat or limit based on health document and filters',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved recommendations',
  })
  @ApiResponse({
    status: 404,
    description: 'Health document not found or invalid data',
  })
  async getFoodRecommendations(@Body() body: GetFoodRecommendationDto) {
    const result =
      await this.foodRecommendationService.getFoodRecommendations(body);

    return Builder<SuccessResponse<any>>()
      .data(result)
      .message('Lấy dữ liệu thành công!')
      .status(StatusCodes.OK)
      .build();
  }
}
