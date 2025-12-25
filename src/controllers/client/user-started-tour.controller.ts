import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { StatusCodes } from 'http-status-codes';
import {
  CurrentUser,
  JwtPayload,
} from 'src/decoractors/current-user.decorator';
import {
  CreateUserStartedTourDto,
  GetUserStartedTourDto,
} from 'src/dtos/user-started-tour.dto';
import { UserStartedTour } from 'src/entities/user-started-tour.entity';
import { UserStartedTourService } from 'src/services/user-started-tour.service';
import {
  ErrorMessages,
  SuccessMessages,
} from 'src/utils/constants/message.constants';
import { AuthGuard } from 'src/utils/auth/auth.guard';
import { SuccessResponse } from 'src/utils/format';

@ApiTags('User Started Tour')
@Controller('started-tour')
@UseGuards(AuthGuard)
export class UserStartedTourController {
  constructor(private readonly userStartedTourService: UserStartedTourService) {
    this.userStartedTourService = userStartedTourService;
  }

  @Post()
  @ApiOperation({ summary: 'Create started tour record for user' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created started tour record',
  })
  async createStartedTour(
    @Body() createDto: CreateUserStartedTourDto,
    @CurrentUser('user_id') userId: number,
  ) {
    const result = await this.userStartedTourService.createStartedTour(
      userId,
      createDto.FEATURE,
    );

    return Builder<SuccessResponse<UserStartedTour | null>>()
      .data(result)
      .message(SuccessMessages.CREATE_SUCCESSFULLY)
      .status(StatusCodes.CREATED)
      .build();
  }

  @Get()
  @ApiOperation({ summary: 'Get user started tour by feature' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user started tour by feature',
  })
  async getStartedTourByFeature(
    @Query() queryDto: GetUserStartedTourDto,
    @CurrentUser('user_id') userId: number,
  ) {
    const result = await this.userStartedTourService.getStartedTourByFeature(
      userId,
      queryDto.FEATURE,
    );

    if (!result) {
      throw new HttpException(ErrorMessages.NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    return Builder<SuccessResponse<UserStartedTour | null>>()
      .data(result)
      .message(SuccessMessages.GET_SUCCESSFULLY)
      .status(StatusCodes.OK)
      .build();
  }
}
