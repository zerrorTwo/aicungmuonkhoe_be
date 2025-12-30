import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Dish } from 'src/entities/dish.entity';

@Injectable()
export class DishRepository extends Repository<Dish> {
  constructor(private dataSource: DataSource) {
    super(Dish, dataSource.createEntityManager());
  }

  /**
   * Find dishes by age group ID
   */
  async findByAgeGroupId(ageGroupId: string): Promise<Dish[]> {
    return this.find({
      where: { AGE_GROUP_ID: ageGroupId, STATUS: 1 },
      relations: ['AGE_RANGE'],
      order: { CREATED_AT: 'DESC' },
    });
  }

  /**
   * Find dishes by multiple age group IDs
   */
  async findByAgeGroupIds(ageGroupIds: string[]): Promise<Dish[]> {
    if (ageGroupIds.length === 0) return [];
    return this.createQueryBuilder('dish')
      .where('dish.AGE_GROUP_ID IN (:...ageGroupIds)', { ageGroupIds })
      .andWhere('dish.STATUS = :status', { status: 1 })
      .orderBy('dish.CREATED_AT', 'DESC')
      .getMany();
  }

  /**
   * Find dish by ID with all details including ingredients
   */
  async findByIdWithDetails(
    id: string,
    ageGroupId: string,
  ): Promise<Dish | null> {
    return this.findOne({
      where: { ID: id, AGE_GROUP_ID: ageGroupId },
      relations: ['AGE_RANGE', 'TAGS'],
    });
  }
}
