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

  // ============================================
  // Admin Methods
  // ============================================

  async getDropdownByModel(
    model: string,
  ): Promise<ConclusionDropboxResponse[]> {
    let result = await this.repository.find({
      where: { MODEL: model },
    });

    // Special handling for BMI model
    if (model === 'BMI') {
      // Filter out TYPE items from BMI
      const filtered = result.filter((item: any) => item.TYPE !== 'TYPE');

      // Get BMI_5_19 TYPE items
      const bmi519Types = await this.repository.find({
        where: { MODEL: 'BMI_5_19', TYPE: 'TYPE' },
      });

      // Modify MODEL field for BMI_5_19 items
      const modifiedBmi519 = bmi519Types.map((item) => ({
        ...item,
        MODEL: 'BMI',
      }));

      // Merge results
      result = [...filtered, ...modifiedBmi519];
    }

    return result;
  }
}
