import { UserRepository } from './user.repository';
import { HealthDocumentRepository } from './health-document.repository';
import { OtpRepository } from './otp.repository';
import { ProvinceRepository } from './province.repository';

const Repositories = [
  UserRepository,
  HealthDocumentRepository,
  OtpRepository,
  ProvinceRepository,
];

export default Repositories;
