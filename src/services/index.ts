import { AuthService } from './auth.service';
import { HealthDocumentService } from './health-document.service';
import { UserService } from './user.service';
import { MailService } from './mail.service';
import { ConclusionService } from './conclusion.service';
import { ProvinceService } from './province.service';
import { UserActiveLogService } from './user-active-log.service';
import { GenderService } from './gender.service';
import { NutritionService } from './nutrition.service';
import { FoodRecommendationService } from './food-recommendation.service';
import { MealPlannerService } from './meal-planner.service';
import { TipsService } from './tip.service';
import { HealthChatbotService } from './health-chatbot.service';
import { AIChatbotService } from './ai-chatbot.service';
import { UserStartedTourService } from './user-started-tour.service';
import { DishService } from './dish.service';
import { CommunityService } from './community.service';
import { BannerService } from './banner.service';
import { FoodService } from './food.service';
import { MaterialGroupService } from './material-group.service';

const Services = [
  UserService,
  AuthService,
  HealthDocumentService,
  MailService,
  ConclusionService,
  ProvinceService,
  UserActiveLogService,
  GenderService,
  NutritionService,
  FoodRecommendationService,
  MealPlannerService,
  TipsService,
  HealthChatbotService,
  AIChatbotService,
  UserStartedTourService,
  DishService,
  CommunityService,
  BannerService,
  FoodService,
  MaterialGroupService,
];

export default Services;
