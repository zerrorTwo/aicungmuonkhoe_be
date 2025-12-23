import { AuthController } from './auth.controller';
import { HealthDocumentController } from './health-document.controller';
import { UserController } from './user.controller';
import { MailController } from './mail.controller';
import { ConclusionController } from './conclusion.controller';
import { ProvinceController } from './province.controller';
import { GenderController } from './gender.controller';
import { TipController } from './tip.controller';
import { ChatbotController } from './chatbot.controller';

const Controllers = [
  UserController,
  AuthController,
  HealthDocumentController,
  MailController,
  ConclusionController,
  ProvinceController,
  GenderController,
  TipController,
  ChatbotController,
];

export default Controllers;
