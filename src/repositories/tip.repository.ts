import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tips } from 'src/entities/tips.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TipRepository {
  private repo: Repository<Tips>;

  constructor(@InjectRepository(Tips) repo: Repository<Tips>) {
    this.repo = repo;
  }

  async getAll(): Promise<Tips[]> {
    const result = await this.repo.find();
    return result;
  }
}
