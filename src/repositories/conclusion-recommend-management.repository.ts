import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConclusionRecommendManagement } from 'src/entities/conclusion-recommend-management.entity';
import { ConclusionModelResponse } from 'src/interfaces/conclusion.interface';
import {
  Gender,
  HealthModel,
  AgeType,
  HEALTH_MODEL,
  GENDER,
} from 'src/utils/constants';

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
      HEALTH_MODEL.HEIGHT,
      HEALTH_MODEL.WEIGHT,
      HEALTH_MODEL.AXIT_URIC,
      HEALTH_MODEL.SGPT,
      HEALTH_MODEL.SGOT,
      HEALTH_MODEL.CREA,
    ];

    const validAgeRange = ['FROM_5_LESS_THAN_12', 'FROM_12_LESS_THAN_20'];

    const validGender = [GENDER.MALE, GENDER.FEMALE];

    if (
      gender &&
      (genderApplicableModels.includes(model as any) ||
        (model === HEALTH_MODEL.BMI &&
          ageType !== undefined &&
          validAgeRange.includes(ageType) &&
          validGender.includes(gender)))
    ) {
      where.GENDER = gender;
    }

    if (ageType !== undefined) {
      where.AGE_TYPE = ageType;
    }

    return this.repository.find({ where });
  }

  async findAll(): Promise<ConclusionModelResponse[]> {
    return await this.repository.find({
      where: {
        IS_DELETED: false,
      },
    });
  }

  // ============================================
  // Admin CRUD Methods
  // ============================================

  async create(
    data: Partial<ConclusionRecommendManagement>,
  ): Promise<ConclusionRecommendManagement> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async update(
    id: number,
    data: Partial<ConclusionRecommendManagement>,
  ): Promise<boolean> {
    const result = await this.repository.update(id, data);
    return (result.affected ?? 0) > 0;
  }

  async findById(id: number): Promise<ConclusionRecommendManagement | null> {
    return await this.repository.findOne({
      where: { ID: id, IS_DELETED: false },
    });
  }

  async deleteByModel(model: string): Promise<boolean> {
    const result = await this.repository.update(
      { MODEL: model },
      { IS_DELETED: true },
    );
    return (result.affected ?? 0) > 0;
  }

  async deleteByModelAndGender(
    model: string,
    gender: string,
  ): Promise<boolean> {
    const result = await this.repository.update(
      { MODEL: model, GENDER: gender },
      { IS_DELETED: true },
    );
    return (result.affected ?? 0) > 0;
  }

  async deleteByFilter(
    model: string,
    gender?: string,
    ageType?: string,
  ): Promise<boolean> {
    const where: any = { MODEL: model };

    if (gender) {
      where.GENDER = gender;
    }

    if (ageType) {
      where.AGE_TYPE = ageType;
    }

    const result = await this.repository.update(where, { IS_DELETED: true });
    return (result.affected ?? 0) > 0;
  }

  async softDelete(id: number): Promise<boolean> {
    const result = await this.repository.update(id, { IS_DELETED: true });
    return (result.affected ?? 0) > 0;
  }
}
