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
}
