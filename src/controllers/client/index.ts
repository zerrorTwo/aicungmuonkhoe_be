import { AuthController } from './auth.controller';
import { HealthDocumentController } from './health-document.controller';
import { UserController } from './user.controller';
import { MailController } from './mail.controller';
import { ConclusionController } from './conclusion.controller';

const Controllers = [
  UserController,
  AuthController,
  HealthDocumentController,
  MailController,
  ConclusionController,
];

export default Controllers;
