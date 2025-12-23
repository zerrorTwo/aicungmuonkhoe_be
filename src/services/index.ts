import { AuthService } from './auth.service';
import { HealthDocumentService } from './health-document.service';
import { UserService } from './user.service';
import { MailService } from './mail.service';
import { ConclusionService } from './conclusion.service';
import { ProvinceService } from './province.service';
import { UserActiveLogService } from './user-active-log.service';
import { GenderService } from './gender.service';
<<<<<<< .merge_file_4xJxUB
import { NutritionService } from './nutrition.service';
import { FoodRecommendationService } from './food-recommendation.service';
import { MealPlannerService } from './meal-planner.service';
=======
import { TipsService } from './tip.service';
import { HealthChatbotService } from './health-chatbot.service';
import { AIChatbotService } from './ai-chatbot.service';
>>>>>>> .merge_file_vhJS4k

const Services = [
  UserService,
  AuthService,
  HealthDocumentService,
  MailService,
  ConclusionService,
  ProvinceService,
  UserActiveLogService,
  GenderService,
<<<<<<< .merge_file_4xJxUB
  NutritionService,
  FoodRecommendationService,
  MealPlannerService,
=======
  TipsService,
  HealthChatbotService,
  AIChatbotService,
>>>>>>> .merge_file_vhJS4k
];

export default Services;
