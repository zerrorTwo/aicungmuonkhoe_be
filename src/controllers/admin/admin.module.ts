import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Controllers from '.';
import Services from 'src/services';
import Repositories from 'src/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { HealthDocument } from '../../entities/health-document.entity';
import { Gender } from '../../entities/gender.entity';
import { ExerciseIntensity } from '../../entities/exercise-intensity.entity';
import { CloudinaryProvider } from '../../providers/cloudinary.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, HealthDocument, Gender, ExerciseIntensity]),
    ConfigModule,
  ],
  controllers: [...Controllers],
  providers: [...Services, ...Repositories, CloudinaryProvider],
})
export class AdminModule { }
