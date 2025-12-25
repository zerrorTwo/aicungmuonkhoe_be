import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Food } from 'src/entities/food.entity';

@Injectable()
export class FoodRepository extends Repository<Food> {
  constructor(private dataSource: DataSource) {
    super(Food, dataSource.createEntityManager());
  }

  /**
   * Find food by ID
   */
  async findById(id: number): Promise<Food | null> {
    return this.findOne({
      where: { ID: id },
    });
  }
}
