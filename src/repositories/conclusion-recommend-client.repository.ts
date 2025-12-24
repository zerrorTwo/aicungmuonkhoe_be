import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConclusionRecommendClient } from 'src/entities/conclusion-recommend-client.entity';

@Injectable()
export class ConclusionRecommendClientRepository {
  private repo: Repository<ConclusionRecommendClient>;

  constructor(
    @InjectRepository(ConclusionRecommendClient)
    repo: Repository<ConclusionRecommendClient>,
  ) {
    this.repo = repo;
  }

  async create(
    conclusion: ConclusionRecommendClient,
  ): Promise<ConclusionRecommendClient> {
    const result = await this.repo.save(conclusion);
    return result;
  }

  async findById(id: number): Promise<ConclusionRecommendClient | null> {
    const result = await this.repo.findOne({
      where: { ID: id },
      relations: ['HEALTH_DOCUMENT'],
    });
    return result;
  }

  async findByHealthDocumentId(
    healthDocumentId: number,
  ): Promise<ConclusionRecommendClient[]> {
    const result = await this.repo.find({
      where: { HEALTH_DOCUMENT_ID: healthDocumentId },
      relations: ['HEALTH_DOCUMENT'],
    });
    return result;
  }

  async update(
    id: number,
    updateData: Partial<ConclusionRecommendClient>,
  ): Promise<ConclusionRecommendClient> {
    const existingEntity = await this.repo.findOne({
      where: { ID: id },
    });

    if (!existingEntity) {
      throw new Error(`ConclusionRecommendClient with id ${id} not found`);
    }

    const updatedEntity = {
      ...existingEntity,
      ...updateData,
      ID: id,
    };

    const result = await this.repo.save(updatedEntity);
    return result;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete({ ID: id });
    return (result.affected ?? 0) > 0;
  }

  async pagination(options: {
    ID?: string;
    MODEL?: string;
    OFFSET?: string;
    LIMIT?: string;
    AGE_TYPE?: string | string[];
    SORT?: string;
  }): Promise<{ data: ConclusionRecommendClient[]; total: number }> {
    const queryBuilder = this.repo
      .createQueryBuilder('conclusion')
      .leftJoinAndSelect('conclusion.HEALTH_DOCUMENT', 'healthDocument');

    // Filter by HEALTH_DOCUMENT_ID
    if (options.ID) {
      queryBuilder.andWhere('conclusion.HEALTH_DOCUMENT_ID = :id', {
        id: options.ID,
      });
    }

    // Filter by MODEL
    if (options.MODEL) {
      queryBuilder.andWhere('conclusion.MODEL = :model', {
        model: options.MODEL,
      });
    }

    // Filter by AGE_TYPE
    if (options.AGE_TYPE) {
      if (Array.isArray(options.AGE_TYPE)) {
        queryBuilder.andWhere('conclusion.AGE_TYPE IN (:...ageTypes)', {
          ageTypes: options.AGE_TYPE,
        });
      } else {
        queryBuilder.andWhere('conclusion.AGE_TYPE = :ageType', {
          ageType: options.AGE_TYPE,
        });
      }
    }

    // Sorting
    if (options.SORT) {
      const sortParts = options.SORT.split(':');
      if (sortParts.length === 2) {
        const [field, direction] = sortParts;
        const validDirection =
          direction.toUpperCase() === 'ASC' ||
          direction.toUpperCase() === 'DESC'
            ? (direction.toUpperCase() as 'ASC' | 'DESC')
            : 'DESC';
        queryBuilder.orderBy(`conclusion.${field}`, validDirection);
      } else {
        queryBuilder.orderBy('conclusion.DATE', 'DESC');
      }
    } else {
      queryBuilder.orderBy('conclusion.DATE', 'DESC');
    }

    // Pagination
    const offset = parseInt(options.OFFSET || '0', 10);
    const limit = parseInt(options.LIMIT || '10', 10);
    queryBuilder.skip(offset * limit).take(limit);

    // Execute query
    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  async range(options: {
    ID?: string;
    START_TIME?: string;
    END_TIME?: string;
    MODEL?: string;
    AGE_TYPE?: string | string[];
    SORT?: string;
  }): Promise<ConclusionRecommendClient[]> {
    const queryBuilder = this.repo
      .createQueryBuilder('conclusion')
      .leftJoinAndSelect('conclusion.HEALTH_DOCUMENT', 'healthDocument');

    // Add where conditions
    if (options.ID) {
      queryBuilder.andWhere('conclusion.HEALTH_DOCUMENT_ID = :id', {
        id: options.ID,
      });
    }

    if (options.START_TIME && options.END_TIME) {
      queryBuilder.andWhere('conclusion.DATE BETWEEN :startTime AND :endTime', {
        startTime: options.START_TIME,
        endTime: options.END_TIME,
      });
    }

    if (options.MODEL) {
      queryBuilder.andWhere('conclusion.MODEL = :model', {
        model: options.MODEL,
      });
    }

    if (options.AGE_TYPE) {
      if (Array.isArray(options.AGE_TYPE)) {
        queryBuilder.andWhere('conclusion.AGE_TYPE IN (:...ageTypes)', {
          ageTypes: options.AGE_TYPE,
        });
      } else {
        queryBuilder.andWhere('conclusion.AGE_TYPE = :ageType', {
          ageType: options.AGE_TYPE,
        });
      }
    }

    // Add sorting
    if (options.SORT) {
      const sortParts = options.SORT.split(':');

      // Validate SORT format: should be "FIELD:DIRECTION" (e.g., "DATE:ASC")
      if (sortParts.length === 2) {
        const [field, direction] = sortParts;
        const validDirection =
          direction?.toUpperCase() === 'ASC' ||
          direction?.toUpperCase() === 'DESC'
            ? (direction.toUpperCase() as 'ASC' | 'DESC')
            : 'DESC';

        queryBuilder.orderBy(`conclusion.${field}`, validDirection);
      } else {
        // Invalid format, use default sorting
        queryBuilder.orderBy('conclusion.DATE', 'DESC');
      }
    } else {
      queryBuilder.orderBy('conclusion.DATE', 'DESC');
    }

    const data = await queryBuilder.getMany();

    return data;
  }
}
