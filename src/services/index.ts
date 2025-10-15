import { AuthService } from './auth.service';
import { HealthDocumentService } from './health-document.service';
import { UserService } from './user.service';
import { MailService } from './mail.service';
import { ProvinceService } from './province.service';

const Services = [
  UserService,
  AuthService,
  HealthDocumentService,
  MailService,
  ProvinceService,
];

export default Services;
