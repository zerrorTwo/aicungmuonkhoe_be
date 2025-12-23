import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpRecord } from 'src/entities/otp-record.entity';
import Repositories from 'src/repositories';
import Services from 'src/services';
import Controllers from '.';
import { ExerciseIntensity } from '../../entities/exercise-intensity.entity';
import { Gender } from '../../entities/gender.entity';
import { HealthDocument } from '../../entities/health-document.entity';
import { User } from '../../entities/user.entity';
import { ConclusionRecommendClient } from '../../entities/conclusion-recommend-client.entity';
import { ConclusionRecommendManagement } from '../../entities/conclusion-recommend-management.entity';
import { ConclusionRecommendDropbox } from '../../entities/conclusion-recommend-dropbox.entity';
import { CloudinaryProvider } from '../../providers/cloudinary.provider';
import { Province } from 'src/entities/province.entity';
import { UsersActiveLog } from 'src/entities/user-active-log.entity';
import { AgeRange } from '../../entities/age-range.entity';
import { HealthStatus } from '../../entities/health-status.entity';
import { MealType } from '../../entities/meal-type.entity';
import { Food } from '../../entities/food.entity';
import { Dish } from '../../entities/dish.entity';
import { NutritionalStandard } from '../../entities/nutritional-standard.entity';
import { NutritionalMealDistribution } from '../../entities/nutritional-meal-distribution.entity';
import { NutritionalIngredientDistribution } from '../../entities/nutritional-ingredient-distribution.entity';
import { FoodRecommendation } from '../../entities/food-recommendation.entity';
import { MealPlanner } from '../../entities/meal-planner.entity';
import { MealPlannerMeal } from '../../entities/meal-planner-meal.entity';
import { MealPlannerMealDish } from '../../entities/meal-planner-meal-dish.entity';
import { Tips } from 'src/entities/tips.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      HealthDocument,
      Gender,
      ExerciseIntensity,
      OtpRecord,
      ConclusionRecommendClient,
      ConclusionRecommendManagement,
      ConclusionRecommendDropbox,
      Province,
      UsersActiveLog,
      AgeRange,
      HealthStatus,
      MealType,
      Food,
      Dish,
      NutritionalStandard,
      NutritionalMealDistribution,
      NutritionalIngredientDistribution,
      FoodRecommendation,
      MealPlanner,
      MealPlannerMeal,
      MealPlannerMealDish,
      Tips,
    ]),
  ],
  controllers: [...Controllers],
  providers: [...Services, ...Repositories, CloudinaryProvider],
})
export class AdminModule {}
