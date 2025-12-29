import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  BulkCreateConclusionDto,
  UpdateConclusionManagementDto,
} from 'src/dtos/conclusion.dto';
import { ConclusionService } from 'src/services/conclusion.service';
import { AdminGuard } from 'src/utils/auth/admin.guard';

@Controller('conclusion-recommendations')
@UseGuards(AdminGuard)
export class ConclusionAdminController {
  constructor(private readonly conclusionService: ConclusionService) {}

  @Get()
  async getConclusionRecommendations(
    @Query('model') model: string,
    @Query('gender') gender?: string,
    @Query('ageType') ageType?: string,
  ) {
    try {
      if (!model) {
        throw new HttpException(
          'Model parameter is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const data = await this.conclusionService.getConclusionManagementByModel(
        model,
        gender,
        ageType,
      );

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get conclusions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getConclusionRecommendation(@Param('id') id: string) {
    try {
      const data =
        await this.conclusionService.getConclusionManagementByModel(id);

      if (!data || data.length === 0) {
        throw new HttpException('Conclusion not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: data[0],
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get conclusion',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async createConclusionRecommendations(
    @Body() body: BulkCreateConclusionDto,
    @Request() req: any,
  ) {
    try {
      // TODO: Extract user ID from JWT token in req.user
      const userId = req.user?.userId || 1; // Default to 1 for now

      await this.conclusionService.bulkCreateConclusionManagement(body, userId);

      return {
        success: true,
        message: 'Conclusions created successfully',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create conclusions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async updateConclusionRecommendation(
    @Param('id') id: string,
    @Body() body: UpdateConclusionManagementDto,
    @Request() req: any,
  ) {
    try {
      const userId = req.user?.userId || 1;

      await this.conclusionService.updateConclusionManagement(
        parseInt(id),
        body,
        userId,
      );

      return {
        success: true,
        message: 'Conclusion updated successfully',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update conclusion',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteConclusionRecommendation(@Param('id') id: string) {
    try {
      await this.conclusionService.deleteConclusionManagement(parseInt(id));

      return {
        success: true,
        message: 'Conclusion deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete conclusion',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('dropdown/:model')
  async getDropdown(@Param('model') model: string) {
    try {
      const data =
        await this.conclusionService.getConclusionDropdownByModel(model);

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get dropdown data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
