import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpException,
  Request,
} from '@nestjs/common';
import { ConclusionService } from 'src/services/conclusion.service';
import {
  BulkCreateConclusionDto,
  UpdateConclusionManagementDto,
  ConclusionManagementQueryDto,
} from 'src/dtos/conclusion.dto';

@Controller('conclusion-recommendations')
export class ConclusionAdminController {
  constructor(private readonly conclusionService: ConclusionService) {}

  /**
   * GET /admin/conclusion-recommendations?model=GLUCOSE_2H
   * Get conclusion recommendations by model name
   */
  @Get()
  async getConclusionRecommendations(@Query('model') model: string) {
    try {
      if (!model) {
        throw new HttpException(
          'Model parameter is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const data =
        await this.conclusionService.getConclusionManagementByModel(model);

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

  /**
   * GET /admin/conclusion-recommendations/:id
   * Get single conclusion recommendation by ID
   */
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

  /**
   * POST /admin/conclusion-recommendations
   * Bulk create/replace conclusion recommendations
   */
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

  /**
   * PATCH /admin/conclusion-recommendations/:id
   * Update single conclusion recommendation
   */
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

  /**
   * DELETE /admin/conclusion-recommendations/:id
   * Delete single conclusion recommendation
   */
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

  /**
   * GET /admin/conclusion-recommendations/dropdown/:model
   * Get dropdown options for a specific model
   */
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
