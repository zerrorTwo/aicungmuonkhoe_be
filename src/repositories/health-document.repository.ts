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

  async create(HealthDocument: HealthDocument): Promise<HealthDocument> {
    const result = await this.repo.save(HealthDocument);
    return result;
  }

  async update(id: number, updateData: any): Promise<HealthDocument> {
    const existingEntity = await this.repo.findOne({
      where: { ID: id },
      relations: ['USER', 'GENDER', 'EXERCISE_INTENSITY']
    });

    if (!existingEntity) {
      throw new Error(`HealthDocument with id ${id} not found`);
    }

    const updatedEntity = {
      ...existingEntity,
      ...updateData,
      ID: id,
    };

    const result = await this.repo.save(updatedEntity);
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
