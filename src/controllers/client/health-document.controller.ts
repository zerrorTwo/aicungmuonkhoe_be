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
import { CreateHealthDocumentDto, UpdateHealthDocumentDto } from 'src/dtos/health-document.dto';
import { HealthDocument } from 'src/entities/health-document.entity';
import { HealthDocumentService } from 'src/services/health-document.service';
import { AuthGuard } from 'src/utils/auth/auth.guard';
import { SuccessMessages } from 'src/utils/constants/message.constants';
import { SuccessResponse } from 'src/utils/format';

@ApiTags('Health Document')
@Controller('health-document')
@UseGuards(AuthGuard)
export class HealthDocumentController {
  constructor(private readonly healthDocumentService: HealthDocumentService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new health document' })
  @ApiResponse({ status: 200, description: 'Successfully created health document' })
  @ApiResponse({
    status: 401,
    description: 'Health document not found or unauthorized',
  })
  async createNew(@Body() createDto: CreateHealthDocumentDto, @Req() req) {
    const user_id = req.user.user_id;
    const result = await this.healthDocumentService.createHealthDocument(user_id, createDto);

    return Builder<SuccessResponse<HealthDocument>>()
      .data(result)
      .message(SuccessMessages.CREATE_SUCCESSFULLY)
      .status(StatusCodes.OK)
      .build();
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a health document by ID' })
  @ApiResponse({ status: 200, description: 'Successfully updated health document' })
  @ApiResponse({
    status: 401,
    description: 'Health document not found or unauthorized',
  })
  async update(@Param('id') id: number, @Body() updateDto: UpdateHealthDocumentDto) {
    const result = await this.healthDocumentService.updateHealthDocument(id, updateDto);

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

    if (!result) {
      throw new HttpException('Health document not found', HttpStatus.NOT_FOUND);
    }

    return Builder<SuccessResponse<HealthDocument>>()
      .data(result)
      .message(SuccessMessages.GET_SUCCESSFULLY)
      .status(StatusCodes.OK)
      .build();
  }

  @Get('/myself')
  @ApiOperation({ summary: 'Get health document information for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved health document information',
  })
  @ApiResponse({ status: 404, description: 'Health document not found' })
  async getHealthDocumentMySelf(@Req() req) {
    const user_id = req.user.user_id;
    const result = await this.healthDocumentService.findHealthDocumentMySelfByUserID(user_id);

    if (!result) {
      throw new HttpException('Health document not found', HttpStatus.NOT_FOUND);
    }

    return Builder<SuccessResponse<HealthDocument>>()
      .data(result)
      .message(SuccessMessages.GET_SUCCESSFULLY)
      .status(StatusCodes.OK)
      .build();
  }
}
