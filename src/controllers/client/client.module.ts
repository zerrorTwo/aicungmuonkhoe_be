import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import Controllers from '.';
import Services from 'src/services';
import Repositories from 'src/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { HealthDocument } from '../../entities/health-document.entity';
import { Gender } from '../../entities/gender.entity';
import { ExerciseIntensity } from '../../entities/exercise-intensity.entity';
import { OtpRecord } from '../../entities/otp-record.entity';
import { ConclusionRecommendClient } from '../../entities/conclusion-recommend-client.entity';
import { ConclusionRecommendManagement } from '../../entities/conclusion-recommend-management.entity';
import { ConclusionRecommendDropbox } from '../../entities/conclusion-recommend-dropbox.entity';
import { CloudinaryProvider } from '../../providers/cloudinary.provider';
import { MulterConfigService } from '../../config/multer.config';
import { Province } from 'src/entities/province.entity';
import { UsersActiveLog } from 'src/entities/user-active-log.entity';
import { Tips } from 'src/entities/tips.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      HealthDocument,
      Gender,
      ExerciseIntensity,
      OtpRecord,
      ConclusionRecommendClient,
      ConclusionRecommendManagement,
      ConclusionRecommendDropbox,
      Province,
      UsersActiveLog,
      Tips,
    ]),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [...Controllers],
  providers: [...Services, ...Repositories, CloudinaryProvider],
})
export class ClientModule {}
