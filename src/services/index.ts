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
];

export default Services;
