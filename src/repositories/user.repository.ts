import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { CreateNewUserDto } from 'src/dtos/user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

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
}
