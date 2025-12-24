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
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MealPlannerService } from '../../services/meal-planner.service';
import { AuthGuard } from '../../utils/auth/auth.guard';
import {
  CreateMealPlannerDto,
  UpdateMealPlannerDto,
  GetMealPlannerDto,
  MarkMealEatenDto,
} from '../../dtos/meal-planner.dto';
import { SuccessResponse } from '../../utils/format';
import { Builder } from 'builder-pattern';
import { StatusCodes } from 'http-status-codes';

@ApiTags('Meal Planner')
@Controller('meal-planner')
@UseGuards(AuthGuard)
export class MealPlannerController {
  constructor(private readonly mealPlannerService: MealPlannerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new meal plan' })
  @ApiResponse({ status: 201, description: 'Meal plan created successfully' })
  async createMealPlanner(@Body() createDto: CreateMealPlannerDto, @Req() req) {
    const userId = req.user.user_id;
    const result = await this.mealPlannerService.createMealPlanner(
      createDto,
      userId,
    );

    return Builder<SuccessResponse<any>>()
      .data(result)
      .message('Meal plan created successfully')
      .status(StatusCodes.CREATED)
      .build();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get meal planner by ID' })
  @ApiResponse({
    status: 200,
    description: 'Meal planner retrieved successfully',
  })
  async getMealPlannerById(@Param('id', ParseIntPipe) id: number) {
    const result = await this.mealPlannerService.getMealPlannerById(id);

    return Builder<SuccessResponse<any>>()
      .data(result)
      .message('Meal planner retrieved successfully')
      .status(StatusCodes.OK)
      .build();
  }

  @Get()
  @ApiOperation({ summary: 'Get meal planners for a health document' })
  @ApiResponse({
    status: 200,
    description: 'Meal planners retrieved successfully',
  })
  async getMealPlanners(@Query() query: GetMealPlannerDto) {
    const result =
      await this.mealPlannerService.getMealPlannersByHealthDocument(
        query.healthDocumentId,
        query.startDate,
        query.endDate,
      );

    return Builder<SuccessResponse<any>>()
      .data(result)
      .message('Meal planners retrieved successfully')
      .status(StatusCodes.OK)
      .build();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update meal planner' })
  @ApiResponse({
    status: 200,
    description: 'Meal planner updated successfully',
  })
  async updateMealPlanner(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateMealPlannerDto,
    @Req() req,
  ) {
    const userId = req.user.user_id;
    const result = await this.mealPlannerService.updateMealPlanner(
      id,
      updateDto,
      userId,
    );

    return Builder<SuccessResponse<any>>()
      .data(result)
      .message('Meal planner updated successfully')
      .status(StatusCodes.OK)
      .build();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete meal planner' })
  @ApiResponse({
    status: 200,
    description: 'Meal planner deleted successfully',
  })
  async deleteMealPlanner(@Param('id', ParseIntPipe) id: number) {
    await this.mealPlannerService.deleteMealPlanner(id);

    return Builder<SuccessResponse<any>>()
      .data(null)
      .message('Meal planner deleted successfully')
      .status(StatusCodes.OK)
      .build();
  }

  @Post('mark-eaten')
  @ApiOperation({ summary: 'Mark a meal as eaten/not eaten' })
  @ApiResponse({ status: 200, description: 'Meal status updated successfully' })
  async markMealAsEaten(@Body() markDto: MarkMealEatenDto, @Req() req) {
    const userId = req.user.user_id;
    await this.mealPlannerService.markMealAsEaten(
      markDto.mealId,
      markDto.eaten,
      userId,
    );

    return Builder<SuccessResponse<any>>()
      .data(null)
      .message('Meal status updated successfully')
      .status(StatusCodes.OK)
      .build();
  }
}
