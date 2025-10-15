import {
  weightBMI,
  heightBMI,
  weightHeightBMI02,
  weightHeightBMI25,
  bmi519,
} from './constants/bmi';
import {
  AGE_TYPE,
  ACTIVE_TAB,
  HEALTH_MODEL,
  COMPARISON_INDICATOR,
  LOGICAL_OPERATOR,
  DROPBOX_TYPE,
  AgeType,
  ActiveTab,
  HealthModel,
  ComparisonIndicator,
  LogicalOperator,
  DropboxType,
} from './constants';

export const Conclusion = {
  getTypeAge: (ageType: number, activeTab: string) => {
    const IS_RANGE_0_TO_2 = 0 < ageType && ageType < 2;
    const IS_RANGE_2_TO_5 = 2 <= ageType && ageType < 5;
    const IS_RANGE_0_TO_5 = 0 <= ageType && ageType < 5;
    const IS_RANGE_5_TO_12 = 5 <= ageType && ageType < 12;
    const IS_RANGE_12_TO_19 = 12 < ageType && ageType < 19;
    const IS_RANGE_19_TO_70 = 19 < ageType && ageType < 70;
    const IS_70_TO_MAX = 70 >= ageType;
    if (activeTab === ACTIVE_TAB.WEIGHT || activeTab === ACTIVE_TAB.HEIGHT)
      return AGE_TYPE.FROM_0_LESS_THAN_5;
    if (activeTab === ACTIVE_TAB.WEIGHT_HEIGHT && IS_RANGE_0_TO_2)
      return AGE_TYPE.FROM_0_LESS_THAN_2;
    if (activeTab === ACTIVE_TAB.WEIGHT_HEIGHT && IS_RANGE_2_TO_5)
      return AGE_TYPE.FROM_2_LESS_THAN_5;
    if (IS_RANGE_0_TO_5) return AGE_TYPE.FROM_0_LESS_THAN_5;
    if (IS_RANGE_5_TO_12) return AGE_TYPE.FROM_5_LESS_THAN_12;
    if (IS_RANGE_12_TO_19) return AGE_TYPE.FROM_12_LESS_THAN_20;
    if (IS_RANGE_19_TO_70) return AGE_TYPE.FROM_20_LESS_THEN_70;
    if (IS_70_TO_MAX) return AGE_TYPE.EQUAL_MORE_THAN_70;
    return null;
  },
  hospital: (valuSys: number, valueDia: number, model: any) => {
    const first =
      model.INDICATOR_FROM === COMPARISON_INDICATOR.ABOUT
        ? Conclusion.compareAbout(valuSys, model.VALUE_FROM, model.VALUE_TO)
        : Conclusion.compare(valuSys, model.VALUE_FROM, model.INDICATOR_FROM);
    const second =
      model.INDICATOR_FROM === COMPARISON_INDICATOR.ABOUT
        ? Conclusion.compareAbout(
            valueDia,
            model.VALUE_ONE_FROM,
            model.VALUE_ONE_TO,
          )
        : Conclusion.compare(
            valueDia,
            model.VALUE_ONE_FROM,
            model.INDICATOR_FROM,
          );
    if (model.INDICATOR_AND === LOGICAL_OPERATOR.AND) {
      return first && second;
    }
    if (model.INDICATOR_AND === LOGICAL_OPERATOR.OR) {
      return first || second;
    }
    return false;
  },
  hungry: (value: number, model: any) => {
    const compare =
      model.INDICATOR_FROM === COMPARISON_INDICATOR.ABOUT
        ? Conclusion.compareAbout(value, model.VALUE_FROM, model.VALUE_TO)
        : Conclusion.compare(value, model.VALUE_FROM, model.INDICATOR_FROM);
    return compare;
  },
  getConclusion: (item: any, models: any[], dropboxs: any[]) => {
    let valueBMI =
      item.MODEL === HEALTH_MODEL.BMI
        ? (item.VALUE_WEIGHT / (item.VALUE_HEIGHT * item.VALUE_HEIGHT)) * 10000
        : item.VALUE;
    const conclusionList = models.filter((model) => {
      // Note: This logic look like just for MODEL BLOODPRESSURE. Let refactor this code later
      if ([HEALTH_MODEL.HOSPITAL, HEALTH_MODEL.HOME].includes(item.MODEL)) {
        return Conclusion.hospital(item.VALUE_SYS, item.VALUE_DIA, model);
      }
      if (
        [
          HEALTH_MODEL.HUNGRY,
          HEALTH_MODEL.TWO_HOURS,
          HEALTH_MODEL.HBA1C,
          HEALTH_MODEL.SGOT,
          HEALTH_MODEL.SGPT,
          HEALTH_MODEL.URE,
          HEALTH_MODEL.TRI,
          HEALTH_MODEL.CREA,
          HEALTH_MODEL.HDL,
          HEALTH_MODEL.LDL,
          HEALTH_MODEL.CHOL,
          HEALTH_MODEL.AXIT_URIC,
          HEALTH_MODEL.BMI,
        ].includes(item.MODEL)
      ) {
        return Conclusion.hungry(valueBMI, model);
      }
      return false;
    });
    const typeList = conclusionList.map((item) => item.TYPE);
    const dropboxList = dropboxs
      .filter((dropbox) => typeList.includes(dropbox.CODE))
      .sort((a, b) => b.INDEX - a.INDEX);
    const conclusion = conclusionList.find(
      (item) => item.TYPE === dropboxList[0]?.CODE,
    );
    item['DROPBOX'] = dropboxList[0]?.CODE || '';
    item['CONCLUSION'] = conclusion?.CONCLUSION || '';
    item['RECOMMEND'] = conclusion?.RECOMMEND || '';
    item['TYPE'] = dropboxList[0]?.NAME || '';
    item['COLOR'] = dropboxList[0]?.COLOR || '';
    item['VALUE'] = valueBMI?.toFixed(2);
    return item;
  },
  getConclusionByBMIType: (
    item: any,
    type: string,
    gender: string,
    dropBoxs: any[],
    models: any[],
    totalMonthAge: number,
    ageType: string,
  ) => {
    let index = 0;
    let valueBMI =
      (item.VALUE_WEIGHT / (item.VALUE_HEIGHT * item.VALUE_HEIGHT)) * 10000;
    if (type === ACTIVE_TAB.WEIGHT) {
      index = weightBMI(item.VALUE_WEIGHT, totalMonthAge, gender);
    }
    if (type === ACTIVE_TAB.HEIGHT) {
      index = heightBMI(item.VALUE_HEIGHT, totalMonthAge, gender);
    }
    if (type === ACTIVE_TAB.WEIGHT_HEIGHT) {
      index =
        ageType === AGE_TYPE.FROM_0_LESS_THAN_2
          ? weightHeightBMI02(item.VALUE_WEIGHT, item.VALUE_HEIGHT, gender)
          : weightHeightBMI25(item.VALUE_WEIGHT, item.VALUE_HEIGHT, gender);
    }

    if (
      ageType === AGE_TYPE.FROM_5_LESS_THAN_12 ||
      ageType === AGE_TYPE.FROM_12_LESS_THAN_20
    ) {
      index = bmi519(valueBMI, totalMonthAge, gender);
    }

    const dropBox = dropBoxs.find(
      (dropBox) =>
        dropBox.INDEX === index && dropBox.TYPE === DROPBOX_TYPE.TYPE,
    );
    const conclusion = models.find((model) => model.TYPE === dropBox?.CODE);

    item['CONCLUSION'] = conclusion?.CONCLUSION || '';
    item['RECOMMEND'] = conclusion?.RECOMMEND || '';
    item['DROPBOX'] = dropBox?.CODE || '';
    item['TYPE'] = dropBox?.NAME || '';
    item['COLOR'] = dropBox?.COLOR || '';
    item['VALUE'] = valueBMI.toFixed(2);
    return item;
  },
  compareAbout: (value: number, input1: number, input2: number) => {
    if (value >= input1 && value <= input2) {
      return true;
    }
    return false;
  },
  compare: (value: number, input: number, type: string) => {
    if (type === COMPARISON_INDICATOR.MORE_THAN) {
      return value > input;
    }
    if (type === COMPARISON_INDICATOR.LESS_THAN_OR_EQUAL) {
      return value <= input;
    }
    if (type === COMPARISON_INDICATOR.LESS_THAN) {
      return value < input;
    }
    if (type === COMPARISON_INDICATOR.MORE_THAN_OR_EQUAL) {
      return value >= input;
    }
    return false;
  },
};
