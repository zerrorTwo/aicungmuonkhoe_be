import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Province } from 'src/entities/province.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProvinceRepository {
  constructor(
    @InjectRepository(Province) private readonly repo: Repository<Province>,
  ) {
    this.repo = repo;
  }

  async findAll(): Promise<Province[] | null> {
    const result = await this.repo.find();
    return result;
  }

  async findById(id?: number): Promise<Province | null> {
    const result = await this.repo.findOne({ where: { PROVINCE_ID: id } });
    return result;
  }
}
