export interface UserResponse {
  USER_ID: number;
  PHONE?: string;
  EMAIL: string;
  START_TOUR?: string;
  STATUS_ACTIVE?: number;
  IS_ADMIN?: number;
  IS_DELETED?: number;
  FACE_IMAGE?: string;
  CREATED_AT?: Date;
  UPDATED_AT?: Date;
}

export interface GenderResponse {
  ID: number;
  NAME: string;
  CD?: string;
  DESC?: string;
  IS_DELETED: boolean;
  CREATED_DATE?: Date;
  CREATED_BY?: number;
  MODIFIED_DATE?: Date;
  MODIFIED_BY?: number;
}

export interface ExerciseIntensityResponse {
  ID: number;
  CODE: string;
  DISPLAY_NAME: string;
}

export interface HealthDocumentResponse {
  ID: number;
  NAME?: string;
  FULL_NAME: string;
  DOB?: string;
  PHONE?: string;
  IS_LINK: boolean;
  IS_SYNC: boolean;
  TYPE?: string;
  HEIGHT?: string;
  WEIGHT?: string;
  HEALTH_STATUS?: string;
  JOB?: string;
  TYPE_ACTION?: string;
  DATE_WORKDAY?: string;
  DATE_OFF?: string;
  IS_MYSELF: boolean;
  IS_UPDATE: boolean;
  AVATAR?: string;
  EXERCISE_FREQUENCY?: string;
  PROVINCE?: string;
}

export interface HealthDocumentWithRelationsResponse
  extends HealthDocumentResponse {
  USER?: UserResponse;
  GENDER?: GenderResponse;
  EXERCISE_INTENSITY?: ExerciseIntensityResponse;
}
