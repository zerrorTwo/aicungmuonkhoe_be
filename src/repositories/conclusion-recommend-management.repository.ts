import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConclusionRecommendManagement } from 'src/entities/conclusion-recommend-management.entity';
import { ConclusionModelResponse } from 'src/interfaces/conclusion.interface';
import { Gender, HealthModel, AgeType } from 'src/utils/constants';

@Injectable()
export class ConclusionRecommendManagementRepository {
  constructor(
    @InjectRepository(ConclusionRecommendManagement)
    private readonly repository: Repository<ConclusionRecommendManagement>,
  ) {}

  async findByModelGenderAndAgeType(
    model: HealthModel,
    gender: Gender,
    ageType: AgeType,
  ): Promise<ConclusionModelResponse[]> {
    return await this.repository.find({
      where: {
        MODEL: model,
        GENDER: gender,
        AGE_TYPE: ageType,
        IS_DELETED: false,
      },
    });
  }

  async findAll(): Promise<ConclusionModelResponse[]> {
    return await this.repository.find({
      where: {
        IS_DELETED: false,
      },
    });
  }
}
