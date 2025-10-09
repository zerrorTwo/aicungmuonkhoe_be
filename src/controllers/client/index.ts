import { AuthController } from './auth.controller';
import { HealthDocumentController } from './health-document.controller';
import { UserController } from './user.controller';
import { MailController } from './mail.controller';

const Controllers = [UserController, AuthController, HealthDocumentController, MailController];

export default Controllers;
