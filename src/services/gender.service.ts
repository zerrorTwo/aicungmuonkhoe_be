import { Injectable, Logger } from '@nestjs/common';
import { GenderRepository } from 'src/repositories/gender.repository';

@Injectable()
export class GenderService {
  private readonly logger = new Logger(GenderService.name);

  constructor(private readonly genderRepository: GenderRepository) {
    this.genderRepository = genderRepository;
  }

  /**
   * Get all genders
   * @returns Array of all genders
   */
  async getAllGenders() {
    this.logger.log('Fetching all genders');
    return await this.genderRepository.findAll();
  }

  /**
   * Get gender by ID
   * @param id - Gender ID
   * @returns Gender entity or null
   */
  async getGenderById(id: number) {
    this.logger.log(`Fetching gender with ID: ${id}`);
    return await this.genderRepository.findById(id);
  }
}
