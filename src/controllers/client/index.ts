import { AuthController } from './auth.controller';
import { HealthDocumentController } from './health-document.controller';
import { UserController } from './user.controller';
import { MailController } from './mail.controller';
import { ConclusionController } from './conclusion.controller';
import { ProvinceController } from './province.controller';
import { GenderController } from './gender.controller';
import { NutritionController } from './nutrition.controller';
import { FoodRecommendationController } from './food-recommendation.controller';
import { MealPlannerController } from './meal-planner.controller';

const Controllers = [
  UserController,
  AuthController,
  HealthDocumentController,
  MailController,
  ConclusionController,
  ProvinceController,
  GenderController,
  NutritionController,
  FoodRecommendationController,
  MealPlannerController,
];

export default Controllers;
