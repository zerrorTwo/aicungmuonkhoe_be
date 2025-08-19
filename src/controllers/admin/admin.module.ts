import { Module } from '@nestjs/common';
import Controllers from '.';
import Services from 'src/services';
import Repositories from 'src/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [...Controllers],
  providers: [...Services, ...Repositories],
})
export class AdminModule {}
