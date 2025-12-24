import { UserRepository } from './user.repository';
import { HealthDocumentRepository } from './health-document.repository';
import { OtpRepository } from './otp.repository';
import { ConclusionRecommendClientRepository } from './conclusion-recommend-client.repository';
import { ConclusionRecommendManagementRepository } from './conclusion-recommend-management.repository';
import { ConclusionRecommendDropboxRepository } from './conclusion-recommend-dropbox.repository';
import { ProvinceRepository } from './province.repository';
import { UserActiveLogRepository } from './user-active-log.repository';
import { GenderRepository } from './gender.repository';
import { NutritionalStandardRepository } from './nutritional-standard.repository';
import { NutritionalMealDistributionRepository } from './nutritional-meal-distribution.repository';
import { NutritionalIngredientDistributionRepository } from './nutritional-ingredient-distribution.repository';
import { FoodRecommendationRepository } from './food-recommendation.repository';
import { MealPlannerRepository } from './meal-planner.repository';
import { MealPlannerMealRepository } from './meal-planner-meal.repository';
import { MealPlannerMealDishRepository } from './meal-planner-meal-dish.repository';
import { TipRepository } from './tip.repository';

const Repositories = [
  UserRepository,
  HealthDocumentRepository,
  OtpRepository,
  ConclusionRecommendClientRepository,
  ConclusionRecommendManagementRepository,
  ConclusionRecommendDropboxRepository,
  ProvinceRepository,
  UserActiveLogRepository,
  GenderRepository,
  NutritionalStandardRepository,
  NutritionalMealDistributionRepository,
  NutritionalIngredientDistributionRepository,
  FoodRecommendationRepository,
  MealPlannerRepository,
  MealPlannerMealRepository,
  MealPlannerMealDishRepository,
  TipRepository,
];

export default Repositories;
