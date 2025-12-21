import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { NutritionalStandard } from '../entities/nutritional-standard.entity';

/**
 * NutritionalStandardRepository
 *
 * Handles database operations for nutritional standards
 *
 * Business Logic:
 * - Finds appropriate standards based on user profile (age, gender, weight, activity)
 * - Supports flexible querying with multiple criteria
 * - Returns standards with related entities (age range, health status, gender, activity)
 */
@Injectable()
export class NutritionalStandardRepository {
  constructor(
    @InjectRepository(NutritionalStandard)
    private readonly repository: Repository<NutritionalStandard>,
  ) {}

  /**
   * Find nutritional standard by exact criteria match
   *
   * @param criteria - Object containing search criteria
   * @returns Nutritional standard with relations
   */
  async findByCriteria(criteria: {
    ageRangeId?: string;
    healthStatusId?: string;
    genderId?: number;
    weight?: number;
    physicalActivityId?: number;
  }): Promise<NutritionalStandard | null> {
    const queryBuilder = this.repository
      .createQueryBuilder('ns')
      .leftJoinAndSelect('ns.AGE_RANGE', 'ageRange')
      .leftJoinAndSelect('ns.HEALTH_STATUS', 'healthStatus')
      .leftJoinAndSelect('ns.GENDER', 'gender')
      .leftJoinAndSelect('ns.PHYSICAL_ACTIVITY', 'physicalActivity');

    // Apply filters based on provided criteria
    if (criteria.ageRangeId) {
      queryBuilder.andWhere('ns.AGE_RANGE_ID = :ageRangeId', {
        ageRangeId: criteria.ageRangeId,
      });
    }

    if (criteria.healthStatusId) {
      queryBuilder.andWhere('ns.HEALTH_STATUS_ID = :healthStatusId', {
        healthStatusId: criteria.healthStatusId,
      });
    }

    if (criteria.genderId) {
      queryBuilder.andWhere('ns.GENDER_ID = :genderId', {
        genderId: criteria.genderId,
      });
    }

    if (criteria.physicalActivityId) {
      queryBuilder.andWhere('ns.PHYSICAL_ACTIVITY_ID = :physicalActivityId', {
        physicalActivityId: criteria.physicalActivityId,
      });
    }

    // Weight range filter
    if (criteria.weight !== undefined) {
      queryBuilder.andWhere(
        'ns.WEIGHT_MIN <= :weight AND ns.WEIGHT_MAX >= :weight',
        {
          weight: criteria.weight,
        },
      );
    }

    return await queryBuilder.getOne();
  }

  /**
   * Find nutritional standard by ID with all relations
   *
   * @param id - Nutritional standard ID
   * @returns Nutritional standard with relations
   */
  async findById(id: number): Promise<NutritionalStandard | null> {
    return await this.repository.findOne({
      where: { ID: id },
      relations: ['AGE_RANGE', 'HEALTH_STATUS', 'GENDER', 'PHYSICAL_ACTIVITY'],
    });
  }

  /**
   * Find all nutritional standards matching partial criteria
   * Useful for suggesting multiple options
   *
   * @param criteria - Partial search criteria
   * @returns Array of matching nutritional standards
   */
  async findAll(criteria?: {
    ageRangeId?: string;
    healthStatusId?: string;
    genderId?: number;
  }): Promise<NutritionalStandard[]> {
    const where: any = {};

    if (criteria?.ageRangeId) {
      where.AGE_RANGE_ID = criteria.ageRangeId;
    }

    if (criteria?.healthStatusId) {
      where.HEALTH_STATUS_ID = criteria.healthStatusId;
    }

    if (criteria?.genderId) {
      where.GENDER_ID = criteria.genderId;
    }

    return await this.repository.find({
      where,
      relations: ['AGE_RANGE', 'HEALTH_STATUS', 'GENDER', 'PHYSICAL_ACTIVITY'],
    });
  }
}
