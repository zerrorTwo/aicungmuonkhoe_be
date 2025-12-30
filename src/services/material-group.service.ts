import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MaterialGroup } from '../entities/material_group.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MaterialGroupService {
  constructor(
    @InjectRepository(MaterialGroup)
    private readonly materialGroupRepository: Repository<MaterialGroup>,
  ) {}

  async findAll(): Promise<MaterialGroup[]> {
    return this.materialGroupRepository.find();
  }
}
