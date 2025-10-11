import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpRecord } from 'src/entities/otp-record.entity';
import Repositories from 'src/repositories';
import Services from 'src/services';
import Controllers from '.';
import { ExerciseIntensity } from '../../entities/exercise-intensity.entity';
import { Gender } from '../../entities/gender.entity';
import { HealthDocument } from '../../entities/health-document.entity';
import { User } from '../../entities/user.entity';
import { CloudinaryProvider } from '../../providers/cloudinary.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      HealthDocument,
      Gender,
      ExerciseIntensity,
      OtpRecord,
    ]),
  ],
  controllers: [...Controllers],
  providers: [...Services, ...Repositories, CloudinaryProvider],
})
export class AdminModule {}
