// Map frontend keys to backend MODEL names
export const CONCLUSION_KEY_MAP: Record<
  string,
  { model: string; gender?: string; ageType?: string }
> = {
  // Blood Pressure
  '1.1': { model: 'BLOOD_PRESSURE_CLINIC' },
  '1.2': { model: 'BLOOD_PRESSURE_HOME' },

  // Blood Sugar
  '2.1': { model: 'GLUCOSE_FASTING' },
  '2.2': { model: 'GLUCOSE_2H' },
  '2.3': { model: 'HBA1C' },

  // Liver Enzyme
  '3.1': { model: 'SGOT' },
  '3.2': { model: 'SGPT' },

  // Lipid
  '4.1': { model: 'CHOLESTEROL' },
  '4.2': { model: 'LDL' },
  '4.3': { model: 'HDL' },
  '4.4': { model: 'TRIGLYCERIDE' },

  // Urea Creatinine
  '5.1': { model: 'UREA' },
  '5.2': { model: 'CREA' },

  // Uric Acid
  '6': { model: 'ACID_URIC' },

  // BMI
  '7': { model: 'BMI' },

  // Height Weight Under 5
  '8.1': { model: 'HEIGHT' },
  '8.2': { model: 'WEIGHT' },
  '8.3': { model: 'WEIGHT_FOR_HEIGHT' },

  // Weight 5-10
  '9': { model: 'WEIGHT_5_10' },

  // Height 5-16
  '10': { model: 'HEIGHT_5_16' },
};

export function parseKeyToModel(
  key: string,
): { model: string; gender?: string; ageType?: string } | null {
  return CONCLUSION_KEY_MAP[key] || null;
}
