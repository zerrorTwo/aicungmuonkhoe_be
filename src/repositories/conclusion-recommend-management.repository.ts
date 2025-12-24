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
    gender?: Gender,
    ageType?: AgeType,
  ): Promise<ConclusionModelResponse[]> {
    const where: any = {
      MODEL: model,
      IS_DELETED: false,
    };

    const genderApplicableModels = [
      'WEIGHT_HEIGHT',
      'HEIGHT',
      'WEIGHT',
      'AXIT_URIC',
      'SGPT',
      'SGOT',
      'CREA',
    ];

    const validAgeRange = ['FROM_5_LESS_THAN_12', 'FROM_12_LESS_THAN_20'];

    // GENDER filter
    if (
      gender &&
      (genderApplicableModels.includes(model) ||
        (model === 'BMI' && validAgeRange.includes(ageType!)))
    ) {
      where.GENDER = gender;
    }

    // AGE_TYPE filter
    if (ageType) {
      where.AGE_TYPE = ageType;
    }

    return await this.repository.find({ where });
  }

  async findAll(): Promise<ConclusionModelResponse[]> {
    return await this.repository.find({
      where: {
        IS_DELETED: false,
      },
    });
  }
}
