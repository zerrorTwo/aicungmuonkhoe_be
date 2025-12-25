import { Injectable, Logger } from '@nestjs/common';
import { UserStartedTourRepository } from 'src/repositories/user-started-tour.repository';
import { UserStartedTour } from 'src/entities/user-started-tour.entity';
import { Feature } from 'src/enums/user-start-tour.enum';

@Injectable()
export class UserStartedTourService {
  private readonly logger = new Logger(UserStartedTourService.name);

  constructor(
    private readonly userStartedTourRepository: UserStartedTourRepository,
  ) {
    this.userStartedTourRepository = userStartedTourRepository;
  }

  async createStartedTour(
    userId: number,
    feature: Feature,
  ): Promise<UserStartedTour | null> {
    return await this.userStartedTourRepository.create(userId, feature);
  }

  async getStartedTourByFeature(
    userId: number,
    feature: Feature,
  ): Promise<UserStartedTour | null> {
    return await this.userStartedTourRepository.findByUserAndFeature(
      userId,
      feature,
    );
  }
}
