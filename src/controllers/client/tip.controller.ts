import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { StatusCodes } from 'http-status-codes';
import { Tips } from 'src/entities/tips.entity';
import { TipsService } from 'src/services/tip.service';
import { SuccessMessages } from 'src/utils/constants/message.constants';
import { SuccessResponse } from 'src/utils/format';

@ApiTags('Tips')
@Controller('tips')
export class TipController {
  constructor(private readonly tipService: TipsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tip' })
  @ApiResponse({ status: 200, description: 'Successfully created tip' })
  async getAll(): Promise<SuccessResponse<Tips[]>> {
    const result = await this.tipService.getAllTips();

    return Builder<SuccessResponse<Tips[]>>()
      .data(result)
      .message(SuccessMessages.CREATE_SUCCESSFULLY)
      .status(StatusCodes.OK)
      .build();
  }
}
