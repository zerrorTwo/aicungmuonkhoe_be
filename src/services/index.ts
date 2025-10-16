import { AuthService } from './auth.service';
import { HealthDocumentService } from './health-document.service';
import { UserService } from './user.service';
import { MailService } from './mail.service';
import { ConclusionService } from './conclusion.service';
import { ProvinceService } from './province.service';

const Services = [
  UserService,
  AuthService,
  HealthDocumentService,
  MailService,
  ConclusionService,
  ProvinceService,
];

export default Services;
