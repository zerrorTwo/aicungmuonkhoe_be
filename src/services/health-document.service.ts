import { Injectable, Logger } from '@nestjs/common';
import { HealthDocumentRepository } from 'src/repositories/health-document.repository';
import { HealthDocument } from 'src/entities/health-document.entity';
import {
  CreateHealthDocumentDto,
  UpdateHealthDocumentDto,
} from 'src/dtos/health-document.dto';
import { plainToInstance } from 'class-transformer';
import { HealthDocumentWithRelationsResponse } from 'src/interfaces/health-document.interface';

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

    if (healthDocument.EXERCISE_INTENSITY_ID) {
      healthDocumentEntity.EXERCISE_INTENSITY = {
        ID: healthDocument.EXERCISE_INTENSITY_ID,
      } as any;
    }

    return this._healthDocumentRepository.create(healthDocumentEntity);
  }

  async updateHealthDocument(
    id: number,
    healthDocument: UpdateHealthDocumentDto,
  ) {
    // Ensure the ID is set in the DTO
    const exist = await this._healthDocumentRepository.findById(id);
    if (!exist) {
      throw new Error(`Health document with id ${id} not found`);
    }
    return this._healthDocumentRepository.update(id, healthDocument);
  }

  async findHealthDocumentByID(
    id: number,
  ): Promise<HealthDocumentWithRelationsResponse> {
    const healthDocument = await this._healthDocumentRepository.findById(id);
    if (!healthDocument) {
      throw new Error(`Health document with id ${id} not found`);
    }
    return healthDocument;
  }

  async findHealthDocumentMySelfByUserID(
    user_id: number,
  ): Promise<HealthDocument> {
    const healthDocument =
      await this._healthDocumentRepository.findMySelfByUserId(user_id);
    if (!healthDocument) {
      throw new Error(`Health document for user with id ${user_id} not found`);
    }
    return healthDocument;
  }
}
