import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HealthDocument } from 'src/entities/health-document.entity';
import { HealthDocumentWithRelationsResponse } from 'src/interfaces/health-document.interface';
import { Repository } from 'typeorm';

@Injectable()
export class HealthDocumentRepository {
  private repo: Repository<HealthDocument>;

  constructor(
    @InjectRepository(HealthDocument) repo: Repository<HealthDocument>,
  ) {
    this.repo = repo;
  }

  async create(HealthDocument: HealthDocument): Promise<HealthDocument> {
    const result = await this.repo.save(HealthDocument);
    return result;
  }

  async update(id: number, updateData: any): Promise<HealthDocument> {
    const existingEntity = await this.repo.findOne({
      where: { ID: id },
      relations: ['USER', 'GENDER', 'EXERCISE_INTENSITY'],
    });

    if (!existingEntity) {
      throw new NotFoundException(`HealthDocument with id ${id} not found`);
    }
    // console.log(updateData);
    console.log(existingEntity);
    console.log('updateData:', updateData);

    // Merge data fields vào existing entity
    // Object.assign chỉ merge shallow fields, không ảnh hưởng relations
    Object.assign(existingEntity, updateData);

    // Save và return với relations
    const result = await this.repo.save(existingEntity);
    return result;
  }

  async findById(
    id: number,
  ): Promise<HealthDocumentWithRelationsResponse | null> {
    const result = await this.repo.findOne({
      where: { ID: id },
      relations: ['USER', 'GENDER', 'EXERCISE_INTENSITY', 'PROVINCE'],
    });
    if (!result) {
      return null;
    }

    return {
      ...result,
      PROVINCE: result.PROVINCE?.NAME,
    };
  }

  async findByUserId(userId: number): Promise<HealthDocument | null> {
    const result = await this.repo.findOne({
      where: { USER: { USER_ID: userId, IS_DELETED: 0 } },
      relations: ['USER'],
    });
    return result;
  }

  async findMySelfByUserId(userId: number): Promise<HealthDocument | null> {
    const result = await this.repo.findOne({
      where: {
        USER: { USER_ID: userId, IS_DELETED: 0 },
        IS_MYSELF: true,
      },
      relations: ['USER'],
    });
    return result;
  }

  async findAllByUserId(userId: number) {
    const result = await this.repo.find({
      where: {
        USER: { USER_ID: userId, IS_DELETED: 0 },
      },
      relations: ['USER', 'USER_LINK', 'GENDER'],
    });
    return result;
  }

  async findMySelfById(
    id: number,
  ): Promise<HealthDocumentWithRelationsResponse | null> {
    const result = await this.repo.findOne({
      where: { ID: id, IS_MYSELF: true },
      relations: ['USER', 'GENDER', 'EXERCISE_INTENSITY', 'PROVINCE'],
    });
    if (!result) {
      return null;
    }
    return {
      ...result,
      PROVINCE: result.PROVINCE?.NAME,
    };
  }
}
