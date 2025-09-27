import { Module } from '@nestjs/common';
import Controllers from '.';
import Services from 'src/services';
import Repositories from 'src/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { HealthDocument } from '../../entities/health-document.entity';
import { Gender } from '../../entities/gender.entity';
import { ExerciseIntensity } from '../../entities/exercise-intensity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, HealthDocument, Gender, ExerciseIntensity])],
  controllers: [...Controllers],
  providers: [...Services, ...Repositories],
})
export class ClientModule { }
