import { Injectable, Logger } from '@nestjs/common';
import { ProvinceRepository } from 'src/repositories/province.repository';

@Injectable()
export class ProvinceService {
  private readonly logger = new Logger(ProvinceService.name);

  constructor(private readonly provinceRepository: ProvinceRepository) {
    this.provinceRepository = provinceRepository;
  }

  async getAllProvinces() {
    return await this.provinceRepository.findAll();
  }
}
