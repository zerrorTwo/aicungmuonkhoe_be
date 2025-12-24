import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  CreateConclusionClientDto,
  UpdateConclusionClientDto,
  ConclusionQueryDto,
} from 'src/dtos/conclusion.dto';
import { ConclusionRecommendClient } from 'src/entities/conclusion-recommend-client.entity';
import { HealthDocumentRepository } from 'src/repositories/health-document.repository';
import { ConclusionRecommendClientRepository } from 'src/repositories/conclusion-recommend-client.repository';
import { ConclusionRecommendManagementRepository } from 'src/repositories/conclusion-recommend-management.repository';
import { ConclusionRecommendDropboxRepository } from 'src/repositories/conclusion-recommend-dropbox.repository';
import {
  ConclusionRecommendClientResponse,
  ConclusionModelResponse,
  ConclusionDropboxResponse,
} from 'src/interfaces/conclusion.interface';
import { HealthDocumentWithRelationsResponse } from 'src/interfaces/health-document.interface';
import { Conclusion } from 'src/utils/conclusion';
import {
  AGE_TYPE,
  ACTIVE_TAB,
  GENDER,
  HEALTH_MODEL,
  COMPARISON_INDICATOR,
  LOGICAL_OPERATOR,
  DROPBOX_TYPE,
  AgeType,
  ActiveTab,
  Gender,
  HealthModel,
  ComparisonIndicator,
  LogicalOperator,
  DropboxType,
} from 'src/utils/constants';

@Injectable()
export class ConclusionService {
  private readonly logger = new Logger(ConclusionService.name);

  constructor(
    private readonly _healthDocumentRepository: HealthDocumentRepository,
    private readonly _conclusionRecommendClientRepository: ConclusionRecommendClientRepository,
    private readonly _conclusionRecommendManagementRepository: ConclusionRecommendManagementRepository,
    private readonly _conclusionRecommendDropboxRepository: ConclusionRecommendDropboxRepository,
  ) {}

  async createConclusionClient(
    conclusionData: CreateConclusionClientDto,
  ): Promise<boolean> {
    const existHealthDoc: HealthDocumentWithRelationsResponse | null =
      await this._healthDocumentRepository.findById(
        conclusionData.HEALTH_DOCUMENT_ID,
      );

    if (!existHealthDoc) {
      throw new Error(
        `Health document with id ${conclusionData.HEALTH_DOCUMENT_ID} not found`,
      );
    }

    // Transform DTO to entity using plainToInstance
    const conclusionEntity = plainToInstance<
      ConclusionRecommendClient,
      CreateConclusionClientDto
    >(ConclusionRecommendClient, conclusionData);

    conclusionEntity.HEALTH_DOCUMENT_ID = conclusionData.HEALTH_DOCUMENT_ID;

    await this._conclusionRecommendClientRepository.create(conclusionEntity);
    return true;
  }

  async updateConclusionClient(
    ID: number,
    conclusionData: UpdateConclusionClientDto,
  ): Promise<boolean> {
    // Check if the conclusion exists
    const existingConclusion =
      await this._conclusionRecommendClientRepository.findById(ID);

    if (!existingConclusion) {
      throw new Error(`ConclusionRecommendClient with id ${ID} not found`);
    }

    // If HEALTH_DOCUMENT_ID is being updated, verify it exists
    if (conclusionData.HEALTH_DOCUMENT_ID) {
      const existHealthDoc: HealthDocumentWithRelationsResponse | null =
        await this._healthDocumentRepository.findById(
          conclusionData.HEALTH_DOCUMENT_ID,
        );

      if (!existHealthDoc) {
        throw new Error(
          `Health document with id ${conclusionData.HEALTH_DOCUMENT_ID} not found`,
        );
      }
    }

    // Transform DTO to entity using plainToInstance
    const updateEntity = plainToInstance<
      ConclusionRecommendClient,
      UpdateConclusionClientDto
    >(ConclusionRecommendClient, conclusionData);

    await this._conclusionRecommendClientRepository.update(ID, updateEntity);
    return true;
  }

  async getConclusionsPagination(queryParams: ConclusionQueryDto): Promise<{
    listData: ConclusionRecommendClient[];
    paging: {
      curPage: number;
      limitPage: number;
      totalRows: number;
      totalPage: number;
    };
  }> {
    try {
      // Validate required parameters
      if (!queryParams.ID) {
        throw new Error('Health document ID is required');
      }

      // Check if health document exists
      const healthDocument: HealthDocumentWithRelationsResponse | null =
        await this._healthDocumentRepository.findById(parseInt(queryParams.ID));

      if (!healthDocument) {
        throw new Error(`Health document with id ${queryParams.ID} not found`);
      }

      // Prepare age type filter
      const ageTypeFilter = queryParams.AGE_TYPE;

      // Get paginated results
      const result = await this._conclusionRecommendClientRepository.pagination(
        {
          ID: queryParams.ID,
          MODEL: queryParams.MODEL,
          OFFSET: queryParams.OFFSET,
          LIMIT: queryParams.LIMIT,
          AGE_TYPE: ageTypeFilter,
          SORT: queryParams.SORT,
        },
      );

      const offset = parseInt(queryParams.OFFSET || '0');
      const limit = parseInt(queryParams.LIMIT || '10');

      return {
        listData: result.data,
        paging: {
          curPage: offset,
          limitPage: limit,
          totalRows: result.total,
          totalPage: Math.ceil(result.total / limit),
        },
      };
    } catch (error) {
      this.logger.error('Error in getConclusionsPagination:', error);
      throw new Error(`Failed to get conclusions pagination: ${error.message}`);
    }
  }

  async getConclusionsRange(queryParams: ConclusionQueryDto): Promise<{
    listData: ConclusionRecommendClient[];
    user?: {
      BOD?: string;
      GENDER?: string;
      FULL_NAME?: string;
      EXERCISE_INTENSITY?: string;
    };
  }> {
    try {
      if (!queryParams.ID) {
        throw new Error('Health document ID is required');
      }

      // Check if health document exists
      const healthDocument: HealthDocumentWithRelationsResponse | null =
        await this._healthDocumentRepository.findById(parseInt(queryParams.ID));

      if (!healthDocument) {
        throw new Error(`Health document with id ${queryParams.ID} not found`);
      }

      // Determine gender for model lookup
      let gender: Gender = GENDER.MALE;
      if (healthDocument.GENDER?.NAME?.toLowerCase() !== 'nam') {
        gender = GENDER.FEMALE;
      }

      // Prepare age type filter
      const validWeightHeight0to5 =
        queryParams.ACTIVE_TAB &&
        (queryParams.ACTIVE_TAB === ACTIVE_TAB.HEIGHT ||
          queryParams.ACTIVE_TAB === ACTIVE_TAB.WEIGHT);
      const validBMI5to19 =
        queryParams.AGE_TYPE &&
        (queryParams.AGE_TYPE === AGE_TYPE.FROM_5_LESS_THAN_12 ||
          queryParams.AGE_TYPE === AGE_TYPE.FROM_12_LESS_THAN_20);

      const currentModel = validWeightHeight0to5
        ? (queryParams.ACTIVE_TAB as HealthModel)
        : (queryParams.MODEL as HealthModel);
      const ageType0to5 = this.getAgeType0to5(
        currentModel || HEALTH_MODEL.BMI,
        queryParams.AGE_TYPE || '',
      );

      const ageTypeFilter = queryParams.AGE_TYPE;

      // Get range results
      const result = await this._conclusionRecommendClientRepository.range({
        ID: queryParams.ID,
        START_TIME: queryParams.START_TIME,
        END_TIME: queryParams.END_TIME,
        MODEL: queryParams.MODEL,
        AGE_TYPE: ageTypeFilter,
        SORT: queryParams.SORT,
      });

      // Fetch models, dropboxes, and user profile in parallel
      const [userProfileResult, models, dropboxs]: [
        HealthDocumentWithRelationsResponse | null,
        ConclusionModelResponse[],
        ConclusionDropboxResponse[],
      ] = await Promise.all([
        this._healthDocumentRepository.findById(parseInt(queryParams.ID)),
        this.getConclusionModel(
          currentModel || HEALTH_MODEL.BMI,
          gender,
          (ageTypeFilter as AgeType) || AGE_TYPE.FROM_0_LESS_THAN_2,
        ),
        this.getConclusionDropBoxByModel(currentModel || HEALTH_MODEL.BMI),
      ]);

      console.log(userProfileResult, models, dropboxs);

      const userProfile: HealthDocumentWithRelationsResponse | null =
        userProfileResult;

      if (!userProfile) {
        throw new Error('User profile not found');
      }

      let processedData: any[];

      // Process data based on age type and active tab
      if (validWeightHeight0to5 || validBMI5to19) {
        processedData = await Promise.all(
          result.map(async (item) => {
            const isWeightHeightTab =
              queryParams.ACTIVE_TAB === ACTIVE_TAB.WEIGHT_HEIGHT;
            const itemAgeType = isWeightHeightTab
              ? item.AGE_TYPE || ageType0to5
              : ageType0to5;
            const currentMonthAge = this.calculateTotalMonthOfAge(
              userProfile.DOB || new Date(),
              new Date(item.DATE),
            );

            // Use the conclusion logic to process BMI type
            return Conclusion.getConclusionByBMIType(
              item,
              currentModel || '',
              gender,
              dropboxs,
              models,
              currentMonthAge,
              itemAgeType,
            );
          }),
        );
      } else {
        // Process data for other age types
        processedData = result.map((item) => {
          // Use the conclusion logic to process general cases
          return Conclusion.getConclusion(item, models, dropboxs);
        });
      }

      // Handle created by user information
      const createdByIds: number[] = [
        ...new Set(
          processedData.map((item) => item?.CREATED_BY).filter((id) => id),
        ),
      ];
      if (createdByIds.length > 0) {
        const createdUsers: any[] =
          await this.getHealthDocumentsByIds(createdByIds);
      }

      // Group data by date and return only the latest entry for each date
      const latestDataByDate: ConclusionRecommendClient[] =
        this.groupDataByLatestDate(processedData);

      return {
        listData:
          queryParams.START_TIME && queryParams.END_TIME
            ? latestDataByDate
            : latestDataByDate.slice(0, 12),
        user: {
          BOD: userProfile.DOB,
          GENDER: userProfile.GENDER?.NAME,
          FULL_NAME: userProfile.FULL_NAME,
          EXERCISE_INTENSITY: userProfile.EXERCISE_INTENSITY?.DISPLAY_NAME,
        },
      };
    } catch (error) {
      this.logger.error('Error in getConclusionsRange:', error);
      throw new Error(`Failed to get conclusions range: ${error.message}`);
    }
  }

  private groupDataByLatestDate(
    data: ConclusionRecommendClient[],
  ): ConclusionRecommendClient[] {
    const groupedData: { [key: string]: ConclusionRecommendClient } =
      data.reduce(
        (
          acc: { [key: string]: ConclusionRecommendClient },
          item: ConclusionRecommendClient,
        ) => {
          const date: string = new Date(item.DATE).toISOString().split('T')[0];
          if (!acc[date] || new Date(item.DATE) > new Date(acc[date].DATE)) {
            acc[date] = item;
          }
          return acc;
        },
        {},
      );

    return Object.values(groupedData);
  }

  private getAgeType0to5(currentModel: HealthModel, ageType: string): string {
    if (ageType === AGE_TYPE.FROM_0_LESS_THAN_2) {
      return AGE_TYPE.FROM_0_LESS_THAN_5;
    }

    if (ageType === AGE_TYPE.FROM_2_LESS_THAN_5) {
      return AGE_TYPE.FROM_0_LESS_THAN_5;
    }

    return ageType;
  }

  private calculateTotalMonthOfAge(
    fromDate: string | Date,
    toDate: string | Date = new Date(),
  ): number {
    const from: Date = new Date(fromDate);
    const to: Date = new Date(toDate);

    const totalMonths: number =
      (to.getFullYear() - from.getFullYear()) * 12 +
      to.getMonth() -
      from.getMonth() +
      (to.getDate() >= from.getDate() ? 0 : -1);

    return totalMonths;
  }

  private async getConclusionModel(
    model: HealthModel,
    gender: Gender,
    ageType: AgeType,
  ): Promise<ConclusionModelResponse[]> {
    try {
      return await this._conclusionRecommendManagementRepository.findByModelGenderAndAgeType(
        model,
        gender,
        ageType,
      );
    } catch (error) {
      this.logger.error('Error in getConclusionModel:', error);
      return [];
    }
  }

  private async getConclusionDropBoxByModel(
    model: HealthModel,
  ): Promise<ConclusionDropboxResponse[]> {
    try {
      return await this._conclusionRecommendDropboxRepository.findByModel(
        model,
      );
    } catch (error) {
      this.logger.error('Error in getConclusionDropBox:', error);
      return [];
    }
  }

  private async getHealthDocumentsByIds(ids: number[]): Promise<any[]> {
    // Placeholder implementation - replace with actual database query
    this.logger.warn('getHealthDocumentsByIds not implemented yet');
    return [];
  }
}
