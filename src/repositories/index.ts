import { UserRepository } from './user.repository';
import { HealthDocumentRepository } from './health-document.repository';
import { OtpRepository } from './otp.repository';
import { ConclusionRecommendClientRepository } from './conclusion-recommend-client.repository';
import { ConclusionRecommendManagementRepository } from './conclusion-recommend-management.repository';
import { ConclusionRecommendDropboxRepository } from './conclusion-recommend-dropbox.repository';
import { ProvinceRepository } from './province.repository';
import { GenderRepository } from './gender.repository';

const Repositories = [
  UserRepository,
  HealthDocumentRepository,
  OtpRepository,
  ConclusionRecommendClientRepository,
  ConclusionRecommendManagementRepository,
  ConclusionRecommendDropboxRepository,
  ProvinceRepository,
  GenderRepository,
];

export default Repositories;
