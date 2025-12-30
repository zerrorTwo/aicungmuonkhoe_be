import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DishIngredient } from 'src/entities/dish-ingredient.entity';

@Injectable()
export class DishIngredientRepository extends Repository<DishIngredient> {
  constructor(private dataSource: DataSource) {
    super(DishIngredient, dataSource.createEntityManager());
  }

  /**
   * Find all ingredients for a dish with food details
   */
  async findByDishId(dishId: string): Promise<DishIngredient[]> {
    return this.createQueryBuilder('di')
      .leftJoinAndSelect('di.FOOD', 'food')
      .where('di.DISH_ID = :dishId', { dishId })
      .getMany();
  }
}
