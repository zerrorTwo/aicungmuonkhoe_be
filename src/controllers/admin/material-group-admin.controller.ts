import { Controller, Get, UseGuards } from '@nestjs/common';
import { MaterialGroupService } from '../../services/material-group.service';
import { AdminGuard } from '../../utils/auth/admin.guard';

@Controller('material-groups')
@UseGuards(AdminGuard)
export class MaterialGroupAdminController {
  constructor(private readonly materialGroupService: MaterialGroupService) {}

  @Get()
  async getList() {
    return await this.materialGroupService.findAll();
  }
}
