import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateHealthDocumentDto, UpdateHealthDocumentDto } from 'src/dtos/health-document.dto';
import { HealthDocument } from 'src/entities/health-document.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class HealthDocumentRepository {
  private repo: Repository<HealthDocument>;

  constructor(@InjectRepository(HealthDocument) repo: Repository<HealthDocument>) {
    this.repo = repo;
  }

  async create(healthDocument: CreateHealthDocumentDto): Promise<HealthDocument> {
    // Transform DTO to entity
    const healthDocumentEntity = plainToInstance(HealthDocument, healthDocument);
    healthDocumentEntity.IS_MYSELF = true;
    healthDocumentEntity.IS_DELETED = false;

    // Save the entity
    const result = await this.repo.save(healthDocumentEntity);
    return result;
  }

  async update(healthDocument: UpdateHealthDocumentDto): Promise<HealthDocument> {
    // Transform DTO to entity
    const healthDocumentEntity = plainToInstance(HealthDocument, healthDocument);
    const result = await this.repo.save(healthDocumentEntity);
    return result;
  }

  async findById(id: number) {
    const result = await this.repo.findOne({
      where: { USER: { USER_ID: id, IS_DELETED: 0 } },
      relations: ['USER'],
    });
    return result;
  }

  async findByUserId(userId: number): Promise<HealthDocument | null> {
    const result = await this.repo.findOne({
      where: { USER: { USER_ID: userId, IS_DELETED: 0 } },
      relations: ['USER']
    });
    return result;
  }

  async findMySelfByUserId(userId: number) {
    const result = await this.repo.findOne({
      where: {
        USER: { USER_ID: userId, IS_DELETED: 0 },
        IS_MYSELF: true,
        IS_DELETED: false
      },
      relations: ['USER']
    });
    return result;
  }

  async findMySelfById(id: number) {
    const result = await this.repo.findOne({
      where: { ID: id, IS_MYSELF: true, IS_DELETED: false },
      relations: ['USER', 'GENDER', 'EXERCISE_INTENSITY']
    });
    return result;
  }

}
