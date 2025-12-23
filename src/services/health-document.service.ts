import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HealthDocumentRepository } from 'src/repositories/health-document.repository';
import { HealthDocument } from 'src/entities/health-document.entity';
import {
  CreateHealthDocumentDto,
  UpdateHealthDocumentDto,
} from 'src/dtos/health-document.dto';
import { plainToInstance } from 'class-transformer';
import { HealthDocumentWithRelationsResponse } from 'src/interfaces/health-document.interface';
import { pickUser } from 'src/utils/auth/common';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class HealthDocumentService {
  private readonly logger = new Logger(HealthDocumentService.name);

  constructor(
    private readonly _healthDocumentRepository: HealthDocumentRepository,
  ) {}

  async createHealthDocument(
    user_id: number,
    healthDocument: CreateHealthDocumentDto,
  ) {
    // Transform DTO to entity using plainToInstance
    const healthDocumentEntity = plainToInstance(
      HealthDocument,
      healthDocument,
    );

    // Set user relation
    healthDocumentEntity.USER = { USER_ID: user_id } as any;

    // Set default values for required fields
    if (healthDocumentEntity.IS_MYSELF === undefined) {
      healthDocumentEntity.IS_MYSELF = true;
    }

    // Set relations if provided
    if (healthDocument.GENDER_ID) {
      healthDocumentEntity.GENDER = { ID: healthDocument.GENDER_ID } as any;
    }

    if (healthDocument.EXERCISE_INTENSITY) {
      healthDocumentEntity.EXERCISE_INTENSITY = {
        ID: healthDocument.EXERCISE_INTENSITY,
      } as any;
    }

    if (healthDocument.PROVINCE) {
      healthDocumentEntity.PROVINCE = { ID: healthDocument.PROVINCE } as any;
    }

    return this._healthDocumentRepository.create(healthDocumentEntity);
  }

  async updateHealthDocument(
    user_id: number,
    id: number,
    healthDocument: UpdateHealthDocumentDto,
  ) {
    // Ensure the ID is set in the DTO
    const exist: HealthDocumentWithRelationsResponse | null =
      await this._healthDocumentRepository.findById(id);
    if (!exist) {
      throw new Error(`Health document with id ${id} not found`);
    }
    const healthDocumentByUserId = this._healthDocumentRepository.findOne(
      user_id,
      id,
    );

    if (!healthDocumentByUserId) {
      throw new NotFoundException(
        `Health document with id ${id} for user with id ${user_id} not found`,
      );
    }
    // Ensure the ID is set in the DTO
    // const exist: HealthDocumentWithRelationsResponse | null =
    //   await this._healthDocumentRepository.findById(user_id, id);
    // if (!exist) {
    //   throw new Error(`Health document with id ${id} not found`);
    // }
    return this._healthDocumentRepository.update(id, healthDocument);
  }

  async findHealthDocumentByID(
    id: number,
  ): Promise<HealthDocumentWithRelationsResponse> {
    const healthDocument: HealthDocumentWithRelationsResponse | null =
      await this._healthDocumentRepository.findById(id);
    if (!healthDocument) {
      throw new NotFoundException(`Health document with id ${id} not found`);
    }
    return healthDocument;
  }

  /**
   * Find health document where IS_MYSELF = true by user_id
   * @param user_id The ID of the user
   * @returns health document
   */
  async findHealthDocumentMySelfByUserID(
    user_id: number,
  ): Promise<HealthDocument> {
    const healthDocument =
      await this._healthDocumentRepository.findMySelfByUserId(user_id);
    if (!healthDocument) {
      throw new NotFoundException(
        `Health document for user with id ${user_id} not found`,
      );
    }
    const result = {
      ...healthDocument,
      USER: pickUser(healthDocument.USER),
    };
    return result;
  }

  async findAllHealthDocumentByUserID(
    user_id: number,
  ): Promise<HealthDocumentWithRelationsResponse[] | null> {
    const allHealthDocument: HealthDocumentWithRelationsResponse[] | null =
      await this._healthDocumentRepository.findAllByUserId(user_id);
    if (!allHealthDocument) {
      throw new NotFoundException(
        `All Health document for user with id ${user_id} not found`,
      );
    }

    const result = allHealthDocument.map((doc) => ({
      ...doc,
      USER: pickUser(doc.USER),
      // USER_LINK: doc.USER_LINK ? pickUser(doc.USER_LINK) : null,
    }));
    return result;
  }
}
