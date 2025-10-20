export interface ConclusionRecommendClientResponse {
  ID: number;
  MODEL?: string;
  DATE?: string;
  VALUE_SYS?: number;
  VALUE_DIA?: number;
  VALUE?: number;
  VALUE_WEIGHT?: number;
  VALUE_HEIGHT?: number;
  INDICATOR?: string;
  TIME?: string;
  HEALTH_DOCUMENT_ID?: number;
  CREATED_DATE: Date;
  AGE_TYPE?: string;
  CREATED_BY?: string;
}

export interface ConclusionModelResponse {
  ID: number;
  MODEL?: string;
  AGE_TYPE?: string;
  TYPE?: string;
  GENDER?: string;
  INDICATOR_FROM?: string;
  INDICATOR_TO?: string;
  INDICATOR_AND?: string;
  VALUE_FROM?: number;
  VALUE_TO?: number;
  VALUE_ONE_FROM?: number;
  VALUE_ONE_TO?: number;
  CONCLUSION?: string;
  RECOMMEND?: string;
  CREATED_DATE?: Date;
  CREATED_BY?: number;
  MODIFIED_DATE?: Date;
  MODIFIED_BY?: number;
}

export interface ConclusionDropboxResponse {
  ID: number;
  NAME: string;
  CODE?: string;
  MODEL?: string;
  TYPE?: string;
  INDEX?: number;
  COLOR?: string;
}
