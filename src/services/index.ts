import { AuthService } from './auth.service';
import { HealthDocumentService } from './health-document.service';
import { UserService } from './user.service';
import { MailService } from './mail.service';

const Services = [UserService, AuthService, HealthDocumentService, MailService];

export default Services;
