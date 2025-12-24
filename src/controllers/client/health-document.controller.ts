import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Param,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { StatusCodes } from 'http-status-codes';
import {
  CreateHealthDocumentDto,
  UpdateHealthDocumentDto,
} from 'src/dtos/health-document.dto';
import { HealthDocument } from 'src/entities/health-document.entity';
import { HealthDocumentWithRelationsResponse } from 'src/interfaces/health-document.interface';
import { HealthDocumentService } from 'src/services/health-document.service';
import { AuthGuard } from 'src/utils/auth/auth.guard';
import { SuccessMessages } from 'src/utils/constants/message.constants';
import { SuccessResponse } from 'src/utils/format';

@ApiTags('Health Document')
@Controller('health-document')
@UseGuards(AuthGuard)
export class HealthDocumentController {
  constructor(private readonly healthDocumentService: HealthDocumentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new health document' })
  @ApiResponse({
    status: 200,
    description: 'Successfully created health document',
  })
  @ApiResponse({
    status: 401,
    description: 'Health document not found or unauthorized',
  })
  async createNew(@Body() createDto: CreateHealthDocumentDto, @Req() req) {
    const user_id = req.user.user_id;

    try {
      const result = await this.healthDocumentService.createHealthDocument(
        user_id,
        createDto,
      );

      return Builder<SuccessResponse<HealthDocument>>()
        .data(result)
        .message(SuccessMessages.CREATE_SUCCESSFULLY)
        .status(StatusCodes.OK)
        .build();
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }
  }

  // ĐẶT /myself TRƯỚC /:id để tránh conflict
  @Get('/myself')
  @ApiOperation({
    summary: 'Get health document information for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved health document information',
  })
  @ApiResponse({ status: 404, description: 'Health document not found' })
  async getHealthDocumentMySelf(@Req() req) {
    const user_id = req.user.user_id;

    if (!user_id) {
      throw new HttpException(
        'User not authenticated',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const result =
      await this.healthDocumentService.findHealthDocumentMySelfByUserID(
        user_id,
      );

    return Builder<SuccessResponse<HealthDocument>>()
      .data(result)
      .message(SuccessMessages.GET_SUCCESSFULLY)
      .status(StatusCodes.OK)
      .build();
  }

  @Get('/all')
  @ApiOperation({
    summary: 'Get all health document information',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved health document information',
  })
  @ApiResponse({ status: 404, description: 'Health document not found' })
  async getHealthDocument(@Req() req) {
    const user_id = req.user.user_id;

    if (!user_id) {
      throw new HttpException(
        'User not authenticated',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const result =
      await this.healthDocumentService.findAllHealthDocumentByUserID(user_id);

    return Builder<SuccessResponse<HealthDocument[]>>()
      .data(result)
      .message(SuccessMessages.GET_SUCCESSFULLY)
      .status(StatusCodes.OK)
      .build();
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a health document by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated health document',
  })
  @ApiResponse({
    status: 401,
    description: 'Health document not found or unauthorized',
  })
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateHealthDocumentDto,
  ) {
    const result = await this.healthDocumentService.updateHealthDocument(
      id,
      updateDto,
    );

    return Builder<SuccessResponse<HealthDocument>>()
      .data(result)
      .message(SuccessMessages.UPDATE_SUCCESSFULLY)
      .status(StatusCodes.OK)
      .build();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get health document information by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved health document information',
  })
  @ApiResponse({ status: 404, description: 'Health document not found' })
  async getHealthDocumentById(@Param('id') id: number) {
    const result = await this.healthDocumentService.findHealthDocumentByID(id);

    return Builder<SuccessResponse<HealthDocumentWithRelationsResponse>>()
      .data(result)
      .message(SuccessMessages.GET_SUCCESSFULLY)
      .status(StatusCodes.OK)
      .build();
  }
}
