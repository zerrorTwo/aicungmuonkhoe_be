import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { CreateNewUserDto } from 'src/dtos/user.dto';
import { User } from 'src/entities/user.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  private repo: Repository<User>;

  constructor(@InjectRepository(User) repo: Repository<User>) {
    this.repo = repo;
  }

  async create(user: CreateNewUserDto): Promise<User> {
    // Transform DTO to entity
    const userEntity = plainToInstance(User, user);
    const result = await this.repo.save(userEntity);
    return result;
  }

  async update(id: number, data: Partial<User>): Promise<User | null> {
    await this.repo.update({ USER_ID: id }, data);
    return this.findById(id);
  }

  async findById(id: number): Promise<User | null> {
    const result = await this.repo.findOne({
      where: { USER_ID: id },
    });
    return result;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.repo.findOne({
      where: { EMAIL: email },
    });
    return result;
  }

  async findByPhone(phone: string): Promise<User | null> {
    const result = await this.repo.findOne({
      where: { PHONE: phone },
    });
    return result;
  }

  async findUserWithHealthDocuments(userId: number): Promise<User | null> {
    const result = await this.repo.findOne({
      where: { USER_ID: userId, IS_DELETED: 0 },
      relations: {
        HEALTH_DOCUMENTS: {
          GENDER: true,
          EXERCISE_INTENSITY: true,
          PROVINCE: true,
        },
      },
    });
    return result;
  }

  async updateFaceImage(userId: number, faceImageUrl: string): Promise<User> {
    await this.repo.update({ USER_ID: userId }, { FACE_IMAGE: faceImageUrl });

    const updatedUser = await this.findById(userId);
    if (!updatedUser) {
      throw new Error(`User with id ${userId} not found after update`);
    }

    return updatedUser;
  }

  async findByListIds(ids: number[]): Promise<User[]> {
    const result = await this.repo.find({
      where: { USER_ID: In(ids), IS_DELETED: 0 },
      relations: ['HEALTH_DOCUMENTS'],
    });
    return result;
  }

  // ============================================
  // Admin Methods
  // ============================================

  async findAllWithPagination(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: number;
    isAdmin?: number;
  }): Promise<{ users: User[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.HEALTH_DOCUMENTS', 'healthDoc')
      .leftJoinAndSelect('healthDoc.GENDER', 'gender')
      .leftJoinAndSelect('healthDoc.PROVINCE', 'province')
      .where('user.IS_DELETED = :isDeleted', { isDeleted: 0 });

    // Search filter
    if (query.search) {
      queryBuilder.andWhere(
        '(user.EMAIL LIKE :search OR user.PHONE LIKE :search OR healthDoc.FULL_NAME LIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    // Status filter
    if (query.status !== undefined) {
      queryBuilder.andWhere('user.STATUS_ACTIVE = :status', {
        status: query.status,
      });
    }

    // Admin filter
    if (query.isAdmin !== undefined) {
      queryBuilder.andWhere('user.IS_ADMIN = :isAdmin', {
        isAdmin: query.isAdmin,
      });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Get paginated results
    const users = await queryBuilder
      .orderBy('user.CREATED_AT', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    return { users, total };
  }

  async softDelete(userId: number): Promise<boolean> {
    const result = await this.repo.update(
      { USER_ID: userId },
      { IS_DELETED: 1 },
    );
    return (result.affected ?? 0) > 0;
  }

  async getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    admins: number;
  }> {
    const total = await this.repo.count({
      where: { IS_DELETED: 0 },
    });

    const active = await this.repo.count({
      where: { IS_DELETED: 0, STATUS_ACTIVE: 1 },
    });

    const inactive = await this.repo.count({
      where: { IS_DELETED: 0, STATUS_ACTIVE: 0 },
    });

    const admins = await this.repo.count({
      where: { IS_DELETED: 0, IS_ADMIN: 1 },
    });

    return { total, active, inactive, admins };
  }
}
