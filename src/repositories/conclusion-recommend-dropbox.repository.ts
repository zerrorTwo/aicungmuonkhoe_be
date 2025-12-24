import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConclusionRecommendDropbox } from 'src/entities/conclusion-recommend-dropbox.entity';
import { ConclusionDropboxResponse } from 'src/interfaces/conclusion.interface';
import { HealthModel, DropboxType } from 'src/utils/constants';

@Injectable()
export class ConclusionRecommendDropboxRepository {
  constructor(
    @InjectRepository(ConclusionRecommendDropbox)
    private readonly repository: Repository<ConclusionRecommendDropbox>,
  ) {}

  async findAll(): Promise<ConclusionDropboxResponse[]> {
    return await this.repository.find();
  }

  async findByModel(model: HealthModel): Promise<ConclusionDropboxResponse[]> {
    return this.repository.find({
      where: {
        MODEL: model,
      },
      order: {
        INDEX: 'ASC', // hoặc 'DESC' nếu nghiệp vụ yêu cầu
      },
    });
  }

  async findByTypeAndIndex(
    type: DropboxType,
    index: number,
  ): Promise<ConclusionDropboxResponse | null> {
    return await this.repository.findOne({
      where: {
        TYPE: type,
        INDEX: index,
      },
    });
  }
}
