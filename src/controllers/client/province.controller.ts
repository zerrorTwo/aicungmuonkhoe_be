import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { StatusCodes } from 'http-status-codes';
import { Province } from 'src/entities/province.entity';
import { ProvinceService } from 'src/services/province.service';
import { SuccessMessages } from 'src/utils/constants/message.constants';
import { SuccessResponse } from 'src/utils/format';

@ApiTags('Province')
@Controller('province')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {
    this.provinceService = provinceService;
  }

  @Get()
  @ApiOperation({ summary: 'Get all provinces' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved provinces',
  })
  async findAll() {
    const result = await this.provinceService.getAllProvinces();
    return Builder<SuccessResponse<Province[] | null>>()
      .data(result)
      .message(SuccessMessages.FETCH_PROVINCES_SUCCESSFULLY)
      .status(StatusCodes.OK)
      .build();
  }
}
