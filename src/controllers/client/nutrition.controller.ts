import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NutritionService } from '../../services/nutrition.service';
import { AuthGuard } from '../../utils/auth/auth.guard';
import { GetNutritionByHealthDocumentDto } from '../../dtos/nutrition.dto';
import { SuccessResponse } from '../../utils/format';
import { Builder } from 'builder-pattern';
import { StatusCodes } from 'http-status-codes';

@ApiTags('Nutrition')
@Controller('nutrition')
@UseGuards(AuthGuard)
export class NutritionController {
  constructor(private readonly nutritionService: NutritionService) {}

  @Get('health-document/:id')
  @ApiOperation({ summary: 'Get nutritional standards for a health document' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved nutrition standards',
  })
  @ApiResponse({ status: 404, description: 'Health document not found' })
  async getNutritionByHealthDocument(
    @Param('id', ParseIntPipe) healthDocumentId: number,
    @Query('mealStructure', ParseIntPipe) mealStructure: number = 3,
  ) {
    const result = await this.nutritionService.getNutritionByHealthDocument(
      healthDocumentId,
      mealStructure,
    );

    return Builder<SuccessResponse<any>>()
      .data(result)
      .message('Nutritional standards retrieved successfully')
      .status(StatusCodes.OK)
      .build();
  }
}
