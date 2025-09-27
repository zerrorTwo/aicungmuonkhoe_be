import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNewUserDto } from 'src/dtos/user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

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

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.repo.findOne({
      where: { email: email },
    });
    return result;
  }
}
