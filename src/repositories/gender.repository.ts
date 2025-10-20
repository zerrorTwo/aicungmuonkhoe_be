import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gender } from 'src/entities/gender.entity';
import { Province } from 'src/entities/province.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GenderRepository {
  constructor(
    @InjectRepository(Gender) private readonly repo: Repository<Gender>,
  ) {
    this.repo = repo;
  }

  async findAll(): Promise<Gender[] | null> {
    const result = await this.repo.find();
    return result;
  }
}
