import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { StatusCodes } from 'http-status-codes';
import { CreateHealthDocumentDto } from 'src/dtos/health-document.dto';
import {
  CreateConclusionClientDto,
  UpdateConclusionClientDto,
  ConclusionQueryDto,
} from 'src/dtos/conclusion.dto';
import { HealthDocument } from 'src/entities/health-document.entity';
import { HealthDocumentService } from 'src/services/health-document.service';
import { ConclusionService } from 'src/services/conclusion.service';
import { AuthGuard } from 'src/utils/auth/auth.guard';
import { SuccessMessages } from 'src/utils/constants/message.constants';
import { SuccessResponse, DataPagination } from 'src/utils/format';

@ApiTags('Conclusion')
@Controller('conclusion')
@UseGuards(AuthGuard)
export class ConclusionController {
  constructor(
    private readonly healthDocumentService: HealthDocumentService,
    private readonly conclusionService: ConclusionService,
  ) {}

  @Post('/client')
  @ApiOperation({ summary: 'Create a new conclusion for client' })
  @ApiResponse({
    status: 200,
    description: 'Successfully created conclusion',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  async createConclusionClient(
    @Body() createDto: CreateConclusionClientDto,
    @Req() req,
  ) {
    try {
      const result = await this.conclusionService.createConclusionClient(
        createDto,
        req,
      );

      return Builder<SuccessResponse<boolean>>()
        .data(result)
        .message(SuccessMessages.CREATE_SUCCESSFULLY)
        .status(StatusCodes.OK)
        .build();
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create conclusion',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('/client/:id')
  @ApiOperation({ summary: 'Update an existing conclusion for client' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated conclusion',
  })
  @ApiResponse({
    status: 404,
    description: 'Conclusion not found',
  })
  async updateConclusionClient(
    @Param('id') id: string,
    @Body() updateDto: UpdateConclusionClientDto,
    @Req() req,
  ) {
    try {
      const result = await this.conclusionService.updateConclusionClient(
        parseInt(id),
        updateDto,
      );

      return Builder<SuccessResponse<boolean>>()
        .data(result)
        .message(SuccessMessages.UPDATE_SUCCESSFULLY)
        .status(StatusCodes.OK)
        .build();
    } catch (error) {
      console.error('Update conclusion error:', error);
      throw new HttpException(
        error.message || 'Failed to update conclusion',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/pagination')
  @ApiOperation({ summary: 'Get conclusions with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved conclusions with pagination',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid parameters',
  })
  async getConclusionsPagination(
    @Query() queryParams: ConclusionQueryDto,
    @Req() req,
  ) {
    try {
      const result =
        await this.conclusionService.getConclusionsPagination(queryParams);

      const response: DataPagination = {
        listData: result.listData,
        paging: result.paging,
        message: SuccessMessages.GET_SUCCESSFULLY,
        status: StatusCodes.OK,
      };

      return response;
    } catch (error) {
      console.error('Get conclusions pagination error:', error);
      throw new HttpException(
        error.message || 'Failed to get conclusions pagination',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/range')
  @ApiOperation({ summary: 'Get conclusions within a date range' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved conclusions within range',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid parameters',
  })
  async getConclusionsRange(@Query() queryParams: ConclusionQueryDto) {
    try {
      const result =
        await this.conclusionService.getConclusionsRange(queryParams);

      return Builder<SuccessResponse<typeof result>>()
        .data(result)
        .message(SuccessMessages.GET_SUCCESSFULLY)
        .status(StatusCodes.OK)
        .build();
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get conclusions range',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
