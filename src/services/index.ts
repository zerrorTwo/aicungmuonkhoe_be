import { AuthService } from './auth.service';
import { HealthDocumentService } from './health-document.service';
import { UserService } from './user.service';
import { MailService } from './mail.service';
import { ConclusionService } from './conclusion.service';
import { ProvinceService } from './province.service';
import { UserActiveLogService } from './user-active-log.service';
import { GenderService } from './gender.service';

const Services = [
  UserService,
  AuthService,
  HealthDocumentService,
  MailService,
  ConclusionService,
  ProvinceService,
  UserActiveLogService,
  GenderService,
];

export default Services;
