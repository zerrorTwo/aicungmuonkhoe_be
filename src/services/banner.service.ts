import { Injectable, Logger } from '@nestjs/common';
import { BannerRepository } from 'src/repositories/banner.repository';
import {
  CreateBannerDto,
  UpdateBannerDto,
  BannerQueryDto,
} from 'src/dtos/banner.dto';
import { BannerEntity } from 'src/entities/banner.entity';
import { CloudinaryProvider } from 'src/providers/cloudinary.provider';

@Injectable()
export class BannerService {
  private readonly logger = new Logger(BannerService.name);

  constructor(
    private readonly bannerRepository: BannerRepository,
    private readonly cloudinaryProvider: CloudinaryProvider,
  ) {}

  async create(
    dto: CreateBannerDto,
    userId: number,
    file?: Express.Multer.File,
  ): Promise<BannerEntity> {
    this.logger.log(`Creating banner by user ${userId}`);
    if (file) {
      const result = await this.cloudinaryProvider.uploadStream(
        file,
        'banners',
      );
      dto.IMAGE = result.secure_url;
    }
    return this.bannerRepository.create(dto, userId);
  }

  async findAll(
    query: BannerQueryDto,
  ): Promise<{ banners: BannerEntity[]; total: number }> {
    return this.bannerRepository.findAll(query);
  }

  async findById(id: number): Promise<BannerEntity | null> {
    return this.bannerRepository.findById(id);
  }

  async update(
    id: number,
    dto: UpdateBannerDto,
    userId: number,
    file?: Express.Multer.File,
  ): Promise<BannerEntity | null> {
    this.logger.log(`Updating banner ${id} by user ${userId}`);

    if (file) {
      const result = await this.cloudinaryProvider.uploadStream(
        file,
        'banners',
      );
      dto.IMAGE = result.secure_url;
    }

    return this.bannerRepository.update(id, dto, userId);
  }

  async delete(id: number): Promise<boolean> {
    this.logger.log(`Deleting banner ${id}`);
    return this.bannerRepository.delete(id);
  }
}
