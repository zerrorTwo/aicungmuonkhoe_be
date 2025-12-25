import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserStartedTour } from 'src/entities/user-started-tour.entity';
import { Feature } from 'src/enums/user-start-tour.enum';
import { Repository } from 'typeorm';

@Injectable()
export class UserStartedTourRepository {
  private repo: Repository<UserStartedTour>;

  constructor(
    @InjectRepository(UserStartedTour) repo: Repository<UserStartedTour>,
  ) {
    this.repo = repo;
  }

  async create(
    userId: number,
    feature: Feature,
  ): Promise<UserStartedTour | null> {
    const existing = await this.findByUserAndFeature(userId, feature);
    if (existing) {
      return existing;
    }

    const entity = this.repo.create({
      USER_ID: userId,
      FEATURE: feature,
      IS_COMPLETED: 1,
    });

    return await this.repo.save(entity);
  }

  async findByUserAndFeature(
    userId: number,
    feature: Feature,
  ): Promise<UserStartedTour | null> {
    return await this.repo.findOne({
      where: {
        USER_ID: userId,
        FEATURE: feature,
      },
    });
  }
}
