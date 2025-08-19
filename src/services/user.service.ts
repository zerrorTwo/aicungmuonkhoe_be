import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { CreateNewUserDto } from 'src/dtos/user.dto';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly _userRepository: UserRepository) {}

  async createEmployee(user: CreateNewUserDto) {
    return this._userRepository.create(user);
  }

  async findUserByID(id: number): Promise<User> {
    const user = await this._userRepository.findById(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }
}
