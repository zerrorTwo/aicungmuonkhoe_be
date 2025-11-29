import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gender } from 'src/entities/gender.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GenderRepository {
  constructor(
    @InjectRepository(Gender) private readonly repo: Repository<Gender>,
  ) {
    this.repo = repo;
  }

  /**
   * Get all genders from database
   * @returns Array of Gender entities
   */
  async findAll(): Promise<Gender[] | null> {
    const result = await this.repo.find({
      where: { IS_DELETED: false },
      order: { ID: 'ASC' },
    });
    return result;
  }

  /**
   * Find gender by ID
   * @param id - Gender ID
   * @returns Gender entity or null
   */
  async findById(id: number): Promise<Gender | null> {
    const result = await this.repo.findOne({
      where: { ID: id, IS_DELETED: false },
    });
    return result;
  }

  /**
   * Find gender by name
   * @param name - Gender name
   * @returns Gender entity or null
   */
  async findByName(name: string): Promise<Gender | null> {
    const result = await this.repo.findOne({
      where: { NAME: name, IS_DELETED: false },
    });
    return result;
  }
}
