import { Injectable, Logger } from '@nestjs/common';
import { GenderRepository } from 'src/repositories/gender.repository';

@Injectable()
export class GenderService {
  private readonly logger = new Logger(GenderService.name);

  constructor(private readonly genderRepository: GenderRepository) {
    this.genderRepository = genderRepository;
  }

  async getAllGenders() {
    return await this.genderRepository.findAll();
  }
}
