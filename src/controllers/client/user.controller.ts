import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { StatusCodes } from 'http-status-codes';
import { CreateNewUserDto } from 'src/dtos/user.dto';
import { UserService } from 'src/services/user.service';
import { SuccessMessages } from 'src/utils/constants/message.constants';
import { SuccessResponse } from 'src/utils/format';
import { User } from '../../entities/user.entity';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new user (face recognition login)' })
  @ApiResponse({ status: 200, description: 'Successfully created user' })
  @ApiResponse({
    status: 401,
    description: 'Employee not found or unauthorized',
  })
  async createNew(@Body() createDto: CreateNewUserDto) {
    const result = await this.userService.createEmployee(createDto);

    return Builder<SuccessResponse<User>>()
      .data(result)
      .message(SuccessMessages.CREATE_SUCCESSFULLY)
      .status(StatusCodes.OK)
      .build();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get employee information by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved employee information',
  })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  async getUserById(@Param('id') id: number) {
    const result = await this.userService.findUserByID(id);

    if (!result) {
      throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
    }

    return Builder<SuccessResponse<User>>()
      .data(result)
      .message(SuccessMessages.GET_SUCCESSFULLY)
      .status(StatusCodes.OK)
      .build();
  }
}
