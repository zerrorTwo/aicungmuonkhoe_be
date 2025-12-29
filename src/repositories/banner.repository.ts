import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BannerEntity } from 'src/entities/banner.entity';
import { Repository } from 'typeorm';
import {
  CreateBannerDto,
  UpdateBannerDto,
  BannerQueryDto,
} from 'src/dtos/banner.dto';

@Injectable()
export class BannerRepository {
  constructor(
    @InjectRepository(BannerEntity)
    private readonly repo: Repository<BannerEntity>,
  ) {}

  async create(dto: CreateBannerDto, userId: number): Promise<BannerEntity> {
    const banner = this.repo.create({
      ...dto,
      CREATED_BY: userId,
      CREATED_AT: new Date(),
      UPDATED_AT: new Date(),
    });
    return this.repo.save(banner);
  }

  async update(
    id: number,
    dto: UpdateBannerDto,
    userId: number,
  ): Promise<BannerEntity | null> {
    await this.repo.update(id, {
      ...dto,
      UPDATED_BY: userId,
      UPDATED_AT: new Date(),
    });
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async findById(id: number): Promise<BannerEntity | null> {
    return this.repo.findOne({ where: { ID: id } });
  }

  async findAll(
    query: BannerQueryDto,
  ): Promise<{ banners: BannerEntity[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repo.createQueryBuilder('banner');

    if (query.search) {
      queryBuilder.andWhere('banner.TITLE LIKE :search', {
        search: `%${query.search}%`,
      });
    }

    if (query.active !== undefined) {
      queryBuilder.andWhere('banner.ACTIVE = :active', {
        active: query.active,
      });
    }

    const total = await queryBuilder.getCount();
    const banners = await queryBuilder
      .orderBy('banner.CREATED_AT', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    return { banners, total };
  }
}
