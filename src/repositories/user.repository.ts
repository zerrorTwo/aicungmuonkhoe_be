import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { CreateNewUserDto } from 'src/dtos/user.dto';

@Injectable()
export class UserRepository {
  private repo: Repository<User>;

  constructor(@InjectRepository(User) repo: Repository<User>) {
    this.repo = repo;
  }

  async create(user: CreateNewUserDto) {
    const result = await this.repo.save(user);
    return result;
  }

  async findById(id: number) {
    const result = await this.repo.findOne({
      where: { user_id: id },
    });
    return result;
  }
}
