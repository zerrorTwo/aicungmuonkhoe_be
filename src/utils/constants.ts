export const AGE_TYPE = {
  FROM_0_LESS_THAN_2: 'FROM_0_LESS_THAN_2',
  FROM_2_LESS_THAN_5: 'FROM_2_LESS_THAN_5',
  FROM_0_LESS_THAN_5: 'FROM_0_LESS_THAN_5',
  FROM_5_LESS_THAN_12: 'FROM_5_LESS_THAN_12',
  FROM_12_LESS_THAN_20: 'FROM_12_LESS_THAN_20',
  FROM_20_LESS_THEN_70: 'FROM_20_LESS_THEN_70',
  EQUAL_MORE_THAN_70: 'EQUAL_MORE_THAN_70',
} as const;

export const ACTIVE_TAB = {
  HEIGHT: 'HEIGHT',
  WEIGHT: 'WEIGHT',
  WEIGHT_HEIGHT: 'WEIGHT_HEIGHT',
} as const;

export const GENDER = {
  MALE: 'nam',
  FEMALE: 'nu',
} as const;

export const HEALTH_MODEL = {
  BMI: 'BMI',
  HOSPITAL: 'HOSPITAL',
  HOME: 'HOME',
  HUNGRY: 'HUNGRY',
  TWO_HOURS: '2_HOURS',
  HBA1C: 'HBA1C',
  SGOT: 'SGOT',
  SGPT: 'SGPT',
  URE: 'URE',
  TRI: 'TRI',
  CREA: 'CREA',
  HDL: 'HDL',
  LDL: 'LDL',
  CHOL: 'CHOL',
  AXIT_URIC: 'AXIT_URIC',
} as const;

export const COMPARISON_INDICATOR = {
  MORE_THAN: 'MORE_THAN',
  LESS_THAN_OR_EQUAL: 'LESS_THAN_OR_EQUAL',
  LESS_THAN: 'LESS_THAN',
  MORE_THAN_OR_EQUAL: 'MORE_THAN_OR_EQUAL',
  ABOUT: 'ABOUT',
} as const;

export const LOGICAL_OPERATOR = {
  AND: 'and',
  OR: 'or',
} as const;

export const DROPBOX_TYPE = {
  TYPE: 'TYPE',
} as const;

// Type definitions for better type safety
export type AgeType = (typeof AGE_TYPE)[keyof typeof AGE_TYPE];
export type ActiveTab = (typeof ACTIVE_TAB)[keyof typeof ACTIVE_TAB];
export type Gender = (typeof GENDER)[keyof typeof GENDER];
export type HealthModel = (typeof HEALTH_MODEL)[keyof typeof HEALTH_MODEL];
export type ComparisonIndicator =
  (typeof COMPARISON_INDICATOR)[keyof typeof COMPARISON_INDICATOR];
export type LogicalOperator =
  (typeof LOGICAL_OPERATOR)[keyof typeof LOGICAL_OPERATOR];
export type DropboxType = (typeof DROPBOX_TYPE)[keyof typeof DROPBOX_TYPE];
