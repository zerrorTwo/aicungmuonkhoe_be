import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  ConclusionQueryDto,
  CreateConclusionClientDto,
  UpdateConclusionClientDto,
} from 'src/dtos/conclusion.dto';
import { ConclusionRecommendClient } from 'src/entities/conclusion-recommend-client.entity';
import {
  ConclusionDropboxResponse,
  ConclusionModelResponse,
} from 'src/interfaces/conclusion.interface';
import { HealthDocumentWithRelationsResponse } from 'src/interfaces/health-document.interface';
import { ConclusionRecommendClientRepository } from 'src/repositories/conclusion-recommend-client.repository';
import { ConclusionRecommendDropboxRepository } from 'src/repositories/conclusion-recommend-dropbox.repository';
import { ConclusionRecommendManagementRepository } from 'src/repositories/conclusion-recommend-management.repository';
import { HealthDocumentRepository } from 'src/repositories/health-document.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { Conclusion } from 'src/utils/conclusion';
import {
  AGE_TYPE,
  AgeType,
  GENDER,
  Gender,
  HEALTH_MODEL,
  HealthModel,
} from 'src/utils/constants';

@Injectable()
export class ConclusionService {
  private readonly logger = new Logger(ConclusionService.name);

  constructor(
    private readonly _healthDocumentRepository: HealthDocumentRepository,
    private readonly _conclusionRecommendClientRepository: ConclusionRecommendClientRepository,
    private readonly _conclusionRecommendManagementRepository: ConclusionRecommendManagementRepository,
    private readonly _conclusionRecommendDropboxRepository: ConclusionRecommendDropboxRepository,
    private readonly _userRepository: UserRepository,
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

  async deleteConclusionClient(ID: number): Promise<boolean> {
    // Check if the conclusion exists
    const existingConclusion =
      await this._conclusionRecommendClientRepository.findById(ID);

    if (!existingConclusion) {
      throw new Error(`ConclusionRecommendClient with id ${ID} not found`);
    }

    const result = await this._conclusionRecommendClientRepository.delete(ID);
    return result;
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

      // Determine gender for model lookup
      let gender: Gender = GENDER.MALE;
      if (healthDocument.GENDER?.NAME?.toLowerCase() !== 'nam') {
        gender = GENDER.FEMALE;
      }

      // Prepare age type filter
      const ageTypeFilter = queryParams.AGE_TYPE as AgeType;

      // Get paginated results
      const result = await this._conclusionRecommendClientRepository.pagination(
        {
          ID: queryParams.ID,
          MODEL:
            queryParams.AGE_TYPE === 'FROM_0_LESS_THAN_5'
              ? queryParams.MODEL
              : queryParams.ACTIVE_TAB,
          OFFSET: queryParams.OFFSET,
          LIMIT: queryParams.LIMIT,
          AGE_TYPE: ageTypeFilter,
          SORT: queryParams.SORT,
        },
      );

      // Fetch models, dropboxes, and user profile in parallel
      const [userProfileResult, models, dropboxs]: [
        HealthDocumentWithRelationsResponse | null,
        ConclusionModelResponse[],
        ConclusionDropboxResponse[],
      ] = await Promise.all([
        this._healthDocumentRepository.findById(parseInt(queryParams.ID)),
        this.getConclusionModel(
          (queryParams.ACTIVE_TAB as HealthModel) || HEALTH_MODEL.BMI,
          gender,
          (queryParams.AGE_TYPE as AgeType) || AGE_TYPE.FROM_0_LESS_THAN_2,
        ),
        this.getConclusionDropBoxByModel(
          (queryParams.ACTIVE_TAB as HealthModel) || HEALTH_MODEL.BMI,
        ),
      ]);

      const userProfile: HealthDocumentWithRelationsResponse | null =
        userProfileResult;

      if (!userProfile) {
        throw new Error('User profile not found');
      }

      let processedData: any[];
      const ageType0to19 = [
        'FROM_0_LESS_THAN_5',
        'FROM_5_LESS_THAN_19',
      ].includes(ageTypeFilter);

      // Process data based on age type and active tab
      if (ageType0to19) {
        processedData = await Promise.all(
          result.data.map(async (item) => {
            const currentMonthAge = this.calculateTotalMonthOfAge(
              userProfile.DOB || new Date(),
              new Date(item.DATE),
            );

            // Use the conclusion logic to process BMI type
            return Conclusion.getConclusionByBMIType(
              item,
              queryParams.ACTIVE_TAB || '',
              gender,
              dropboxs,
              models,
              currentMonthAge,
              ageTypeFilter,
            );
          }),
        );
      } else {
        // Process data for other age types
        processedData = result.data.map((item) => {
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

      let createdUsersMap: Map<number, { fullName: string; avatar: string }> =
        new Map();
      if (createdByIds.length > 0) {
        const createdUsers =
          await this._userRepository.findByListIds(createdByIds);

        if (createdUsers) {
          createdUsersMap = new Map(
            createdUsers.map((user) => {
              const fullName =
                user.HEALTH_DOCUMENTS?.[0]?.FULL_NAME ||
                user.EMAIL ||
                'Unknown';
              const avatar = user.HEALTH_DOCUMENTS?.[0]?.AVATAR;
              return [user.USER_ID, { fullName, avatar }];
            }),
          );
        }
      }

      const finalData = processedData.map((item) => ({
        ...item,
        CREATED_NAME: item.CREATED_BY
          ? createdUsersMap.get(item.CREATED_BY)?.fullName || 'Unknown'
          : 'Unknown',
        CREATED_AVATAR: item.CREATED_BY
          ? createdUsersMap.get(item.CREATED_BY)?.avatar || 'Unknown'
          : 'Unknown',
      }));

      const offset = parseInt(queryParams.OFFSET || '0');
      const limit = parseInt(queryParams.LIMIT || '10');

      return {
        listData: finalData,
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

      const ageTypeFilter = queryParams.AGE_TYPE as AgeType;

      // Get range results
      const result = await this._conclusionRecommendClientRepository.range({
        ID: queryParams.ID,
        START_TIME: queryParams.START_TIME,
        END_TIME: queryParams.END_TIME,
        MODEL:
          queryParams.AGE_TYPE === 'FROM_0_LESS_THAN_5'
            ? queryParams.MODEL
            : queryParams.ACTIVE_TAB,
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
          (queryParams.ACTIVE_TAB as HealthModel) || HEALTH_MODEL.BMI,
          gender,
          (queryParams.AGE_TYPE as AgeType) || AGE_TYPE.FROM_0_LESS_THAN_2,
        ),
        this.getConclusionDropBoxByModel(
          (queryParams.ACTIVE_TAB as HealthModel) || HEALTH_MODEL.BMI,
        ),
      ]);

      const userProfile: HealthDocumentWithRelationsResponse | null =
        userProfileResult;

      if (!userProfile) {
        throw new Error('User profile not found');
      }

      let processedData: any[];
      const ageType0to19 = [
        'FROM_0_LESS_THAN_5',
        'FROM_5_LESS_THAN_19',
      ].includes(ageTypeFilter);

      // Process data based on age type and active tab
      if (ageType0to19) {
        processedData = await Promise.all(
          result.map(async (item) => {
            const currentMonthAge = this.calculateTotalMonthOfAge(
              userProfile.DOB || new Date(),
              new Date(item.DATE),
            );

            // Use the conclusion logic to process BMI type
            return Conclusion.getConclusionByBMIType(
              item,
              queryParams.ACTIVE_TAB || '',
              gender,
              dropboxs,
              models,
              currentMonthAge,
              ageTypeFilter,
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

  // ============================================
  // Admin Methods
  // ============================================

  async getConclusionManagementByModel(
    model: string,
    gender?: string,
    ageType?: string,
  ): Promise<ConclusionModelResponse[]> {
    try {
      return await this._conclusionRecommendManagementRepository.findByModelGenderAndAgeType(
        model as HealthModel,
        gender as Gender,
        ageType as AgeType,
      );
    } catch (error) {
      this.logger.error('Error in getConclusionManagementByModel:', error);
      throw new Error(`Failed to get conclusion management: ${error.message}`);
    }
  }

  async bulkCreateConclusionManagement(
    data: {
      model: string;
      gender?: string;
      ageType?: string;
      items: any[];
    },
    userId: number,
  ): Promise<boolean> {
    try {
      const { model, gender, ageType, items } = data;

      // Delete existing data based on model type
      if (model === 'BMI' && ageType) {
        await this._conclusionRecommendManagementRepository.deleteByFilter(
          model,
          gender,
          ageType,
        );
      } else if (gender) {
        await this._conclusionRecommendManagementRepository.deleteByModelAndGender(
          model,
          gender,
        );
      } else {
        await this._conclusionRecommendManagementRepository.deleteByModel(
          model,
        );
      }

      // Create new items
      const createPromises = items.map((item) => {
        const dataToCreate = {
          ...item,
          AGE_TYPE:
            model === 'HEIGHT'
              ? 'FROM_0_LESS_THAN_5'
              : item.AGE_TYPE || ageType,
          GENDER: gender,
          CREATED_BY: userId,
          MODIFIED_BY: userId,
        };
        return this._conclusionRecommendManagementRepository.create(
          dataToCreate,
        );
      });

      await Promise.all(createPromises);
      return true;
    } catch (error) {
      this.logger.error('Error in bulkCreateConclusionManagement:', error);
      throw new Error(`Failed to bulk create conclusions: ${error.message}`);
    }
  }

  async updateConclusionManagement(
    id: number,
    data: any,
    userId: number,
  ): Promise<boolean> {
    try {
      const existing =
        await this._conclusionRecommendManagementRepository.findById(id);

      if (!existing) {
        throw new Error(`Conclusion with id ${id} not found`);
      }

      const updateData = {
        ...data,
        MODIFIED_BY: userId,
      };

      return await this._conclusionRecommendManagementRepository.update(
        id,
        updateData,
      );
    } catch (error) {
      this.logger.error('Error in updateConclusionManagement:', error);
      throw new Error(
        `Failed to update conclusion management: ${error.message}`,
      );
    }
  }

  async deleteConclusionManagement(id: number): Promise<boolean> {
    try {
      const existing =
        await this._conclusionRecommendManagementRepository.findById(id);

      if (!existing) {
        throw new Error(`Conclusion with id ${id} not found`);
      }

      return await this._conclusionRecommendManagementRepository.softDelete(id);
    } catch (error) {
      this.logger.error('Error in deleteConclusionManagement:', error);
      throw new Error(
        `Failed to delete conclusion management: ${error.message}`,
      );
    }
  }

  async getConclusionDropdownByModel(
    model: string,
  ): Promise<ConclusionDropboxResponse[]> {
    try {
      return await this._conclusionRecommendDropboxRepository.getDropdownByModel(
        model,
      );
    } catch (error) {
      this.logger.error('Error in getConclusionDropdownByModel:', error);
      throw new Error(`Failed to get dropdown data: ${error.message}`);
    }
  }
}
