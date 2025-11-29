import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { StatusCodes } from 'http-status-codes';
import { Gender } from 'src/entities/gender.entity';
import { GenderService } from 'src/services/gender.service';
import { SuccessMessages } from 'src/utils/constants/message.constants';
import { SuccessResponse } from 'src/utils/format';

@ApiTags('Gender')
@Controller('gender')
export class GenderController {
  constructor(private readonly genderService: GenderService) {
    this.genderService = genderService;
  }

  @Get()
  @ApiOperation({ summary: 'Get all genders' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved genders',
  })
  async findAll() {
    const result = await this.genderService.getAllGenders();
    return Builder<SuccessResponse<Gender[] | null>>()
      .data(result)
      .message(SuccessMessages.FETCH_GENDERS_SUCCESSFULLY)
      .status(StatusCodes.OK)
      .build();
  }
}
