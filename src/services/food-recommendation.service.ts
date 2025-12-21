import { Injectable, NotFoundException } from '@nestjs/common';
import { FoodRecommendationRepository } from '../repositories/food-recommendation.repository';
import { HealthDocumentRepository } from '../repositories/health-document.repository';
import {
  GetFoodRecommendationDto,
  FoodRecommendationResponseDto,
  TypeAdvice,
} from '../dtos/food-recommendation.dto';

/**
 * FoodRecommendationService
 *
 * Provides food recommendations based on health document
 *
 * Business Logic:
 * - Gets health document to determine user's health status
 * - Returns foods based on typeAdvice (NENAN or HANCHEAN)
 * - Supports filtering by search, food groups, fat levels, GI levels
 * - Implements pagination for large result sets
 * - Sorting logic varies by health condition and typeAdvice
 */
@Injectable()
export class FoodRecommendationService {
  constructor(
    private readonly foodRecommendationRepo: FoodRecommendationRepository,
    private readonly healthDocumentRepo: HealthDocumentRepository,
  ) {}

  /**
   * Get food recommendations based on health document
   *
   * Process:
   * 1. Get health document and validate
   * 2. Determine health status from document
   * 3. Query foods based on filters
   * 4. Apply sorting logic
   * 5. Paginate results
   *
   * @param dto - Query parameters
   * @returns Paginated food recommendations
   */
  async getFoodRecommendations(
    dto: GetFoodRecommendationDto,
  ): Promise<FoodRecommendationResponseDto> {
    // 1. Get health document
    const healthDocument = await this.healthDocumentRepo.findById(
      dto.healthDocumentId,
    );

    if (!healthDocument) {
      throw new NotFoundException('Hồ sơ sức khỏe không tồn tại!');
    }

    // 2. Validate required fields
    if (
      !healthDocument.HEIGHT ||
      !healthDocument.WEIGHT ||
      !healthDocument.GENDER ||
      !healthDocument.DOB
    ) {
      throw new NotFoundException(
        'Vui lòng kiểm tra thông tin chiều cao, cân nặng, giới tính, ngày sinh!',
      );
    }

    // 3. Determine health status
    const healthStatusId = await this.determineHealthStatus(healthDocument);

    if (!healthStatusId) {
      throw new NotFoundException('Không xác định được tình trạng sức khỏe!');
    }

    // 4. Query foods with filters
    const { foods, total } = await this.foodRecommendationRepo.findWithFilters({
      healthStatusId,
      typeAdvice: dto.typeAdvice,
      search: dto.search,
      foodGroups: dto.foodGroups,
      fatLevels: dto.fatLevels,
      giLevels: dto.giLevels,
      page: dto.page || 1,
      limit: dto.limit || 10,
    });

    // 5. Sort foods based on logic
    const sortedFoods = this.sortFoods(
      foods,
      dto.typeAdvice,
      healthStatusId,
      healthDocument,
    );

    // 6. Paginate
    const skip = ((dto.page || 1) - 1) * (dto.limit || 10);
    const paginatedFoods = sortedFoods.slice(skip, skip + (dto.limit || 10));

    return {
      healthStatusId,
      listData: paginatedFoods.map((food) => ({
        ID: food.ID,
        NAME: food.NAME,
        IMAGE: food.IMAGE,
        IMAGE_COOKED: food.IMAGE_COOKED,
        ENERGY: food.ENERGY,
        FAT: food.FAT,
        PROTEIN: food.PROTEIN,
        GROUP_FOOD: food.GROUP_FOOD,
        FOOD_GROUP_NAME: this.getFoodGroupName(food.GROUP_FOOD),
        PROTEIN_CLASSIFICATION: food.PROTEIN_CLASSIFICATION,
        SUGAR_CLASSIFICATION: food.SUGAR_CLASSIFICATION,
        FRUIT_CLASSIFICATION: food.FRUIT_CLASSIFICATION,
      })),
      paging: {
        curPage: dto.page || 1,
        limitPage: dto.limit || 10,
        totalRows: total,
        totalPage: Math.ceil(total / (dto.limit || 10)),
      },
    };
  }

  /**
   * Determine health status from health document
   *
   * Logic:
   * - Check for specific diseases (diabetes, hypertension, etc.)
   * - Calculate BMI to determine if overweight/obesity
   * - Return appropriate health status ID
   */
  private determineHealthStatus(healthDocument: any): string | null {
    // Check if health document has health status directly
    if (healthDocument.HEALTH_STATUS) {
      return healthDocument.HEALTH_STATUS;
    }

    // Calculate BMI
    const height = parseFloat(healthDocument.HEIGHT) / 100; // cm to m
    const weight = parseFloat(healthDocument.WEIGHT);
    const bmi = weight / (height * height);

    // Determine based on BMI
    if (bmi >= 30) {
      return 'TTSK003'; // Béo phì
    } else if (bmi >= 25) {
      return 'TTSK004'; // Thừa cân
    } else if (bmi >= 18.5) {
      return 'TTSK002'; // Bình thường
    } else {
      return 'TTSK005'; // Thiếu cân
    }
  }

  /**
   * Sort foods based on typeAdvice and health condition
   *
   * For NENAN (Should eat):
   * - No group priority, only sort within groups
   * - Milk: A-Z by name
   * - Protein/Nuts: Fat level 1→17, then A-Z
   * - Starch: GI low→medium→high→null, then A-Z
   * - Vegetables: A-Z (no GI info)
   * - Fruits: GI low→medium→high→null, then A-Z
   *
   * For HANCHEAN (Should limit):
   * - Group priority varies by disease
   * - Within groups: same sorting as NENAN
   */
  private sortFoods(
    foods: any[],
    typeAdvice: TypeAdvice,
    healthStatusId: string,
    healthDocument: any,
  ): any[] {
    if (typeAdvice === TypeAdvice.NENAN) {
      return this.sortNENAN(foods);
    } else {
      return this.sortHANCHEAN(foods, healthStatusId, healthDocument);
    }
  }

  /**
   * Sort for NENAN (Should eat) - no group priority
   */
  private sortNENAN(foods: any[]): any[] {
    return foods.sort((a, b) => {
      const groupA = a.GROUP_FOOD;
      const groupB = b.GROUP_FOOD;

      // If same group, sort within group
      if (groupA === groupB) {
        return this.sortWithinGroup(a, b, groupA);
      }

      // No group priority, keep original order
      return 0;
    });
  }

  /**
   * Sort for HANCHEAN (Should limit) - with group priority
   */
  private sortHANCHEAN(
    foods: any[],
    healthStatusId: string,
    healthDocument: any,
  ): any[] {
    const groupPriority = this.getGroupPriority(healthStatusId, healthDocument);

    return foods.sort((a, b) => {
      const priorityA = groupPriority.indexOf(a.GROUP_FOOD);
      const priorityB = groupPriority.indexOf(b.GROUP_FOOD);

      // Sort by group priority first
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // Within same group, sort by specific rules
      return this.sortWithinGroup(a, b, a.GROUP_FOOD);
    });
  }

  /**
   * Get group priority based on health condition
   */
  private getGroupPriority(
    healthStatusId: string,
    healthDocument: any,
  ): string[] {
    // Case 1: Lipid disorders, Gout
    if (
      ['LIPID_DISORDER', 'GOUT', 'ROILOANLIPID', 'ROILOANMOMAU'].includes(
        healthStatusId,
      )
    ) {
      return [
        'THUCPHAMGIAUCHATDAM',
        'SUAVACACSANPHAMTUSUA',
        'THUCPHAMGIAUCHATBOTDUONG',
        'RAUCUQUA',
        'HATDAUMOBO',
        'TRAICAY',
      ];
    }

    // Case 2: Diabetes
    if (['DIABETES', 'DAITHADUONG'].includes(healthStatusId)) {
      return [
        'THUCPHAMGIAUCHATBOTDUONG',
        'TRAICAY',
        'THUCPHAMGIAUCHATDAM',
        'SUAVACACSANPHAMTUSUA',
        'RAUCUQUA',
        'HATDAUMOBO',
      ];
    }

    // Case 3: Normal or not specified
    return [
      'THUCPHAMGIAUCHATBOTDUONG',
      'THUCPHAMGIAUCHATDAM',
      'RAUCUQUA',
      'HATDAUMOBO',
      'TRAICAY',
      'SUAVACACSANPHAMTUSUA',
    ];
  }

  /**
   * Sort within same food group
   */
  private sortWithinGroup(a: any, b: any, group: string): number {
    // For milk group: A-Z by name
    if (group === 'SUAVACACSANPHAMTUSUA') {
      return a.NAME.localeCompare(b.NAME, 'vi');
    }

    // For protein and nuts groups: Fat level 1→17, then A-Z
    if (group === 'THUCPHAMGIAUCHATDAM' || group === 'HATDAUMOBO') {
      const fatA = this.extractFatLevel(a.PROTEIN_CLASSIFICATION);
      const fatB = this.extractFatLevel(b.PROTEIN_CLASSIFICATION);

      if (fatA !== fatB) {
        return fatA - fatB;
      }
      return a.NAME.localeCompare(b.NAME, 'vi');
    }

    // For starch group: GI low→medium→high→null, then A-Z
    if (group === 'THUCPHAMGIAUCHATBOTDUONG') {
      const giA = this.getGIPriority(a.SUGAR_CLASSIFICATION);
      const giB = this.getGIPriority(b.SUGAR_CLASSIFICATION);

      if (giA !== giB) {
        return giA - giB;
      }
      return a.NAME.localeCompare(b.NAME, 'vi');
    }

    // For vegetables: A-Z (no GI info)
    if (group === 'RAUCUQUA') {
      return a.NAME.localeCompare(b.NAME, 'vi');
    }

    // For fruits: GI low→medium→high→null, then A-Z
    if (group === 'TRAICAY') {
      const giA = this.getGIPriority(a.FRUIT_CLASSIFICATION);
      const giB = this.getGIPriority(b.FRUIT_CLASSIFICATION);

      if (giA !== giB) {
        return giA - giB;
      }
      return a.NAME.localeCompare(b.NAME, 'vi');
    }

    // Default: A-Z by name
    return a.NAME.localeCompare(b.NAME, 'vi');
  }

  /**
   * Extract fat level number from classification (MUCBEO1 → 1)
   */
  private extractFatLevel(classification: string): number {
    if (!classification) return 99;
    const match = classification.match(/MUCBEO(\d+)/);
    return match ? parseInt(match[1]) : 99;
  }

  /**
   * Get GI priority for sorting (low=1, medium=2, high=3, null=4)
   */
  private getGIPriority(classification: string): number {
    if (!classification) return 4;
    if (classification === 'GITHAP') return 1;
    if (classification === 'GITRUNGBINH') return 2;
    if (classification === 'GICAO') return 3;
    return 4;
  }

  /**
   * Get food group display name
   */
  private getFoodGroupName(groupCode: string): string {
    const groupNames = {
      THUCPHAMGIAUCHATBOTDUONG: 'Thực phẩm giàu chất bột đường',
      THUCPHAMGIAUCHATDAM: 'Thực phẩm giàu chất đạm',
      THUCPHAMGIAUCHATBEO: 'Thực phẩm giàu chất béo',
      RAUCUQUA: 'Rau củ quả',
      TRAICAY: 'Trái cây',
      HATDAUMOBO: 'Hạt & dầu, mỡ, bơ',
      SUAVACACSANPHAMTUSUA: 'Sữa và các sản phẩm từ sữa',
      KHAC: 'Khác',
    };

    return groupNames[groupCode] || groupCode;
  }
}
