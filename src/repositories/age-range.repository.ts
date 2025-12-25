import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AgeRange } from 'src/entities/age-range.entity';

@Injectable()
export class AgeRangeRepository extends Repository<AgeRange> {
  constructor(private dataSource: DataSource) {
    super(AgeRange, dataSource.createEntityManager());
  }

  /**
   * Get all age group IDs by age in months
   * One age can belong to multiple age groups
   */
  async getAgeGroupIdByAge(ageInMonths: number): Promise<string[]> {
    // Based on the age ranges from the image
    // Convert to years for easier comparison
    const ageInYears = ageInMonths / 12;
    const ageGroups: string[] = [];

    // 0 - dưới 5 tuổi (0-60 tháng)
    if (ageInMonths < 60) ageGroups.push('DT00_DT06');

    // 7 - dưới 9 tháng tuổi
    if (ageInMonths >= 7 && ageInMonths < 9) ageGroups.push('DT01');

    // 9 - dưới 12 tháng tuổi
    if (ageInMonths >= 9 && ageInMonths < 12) ageGroups.push('DT02');

    // 12 - dưới 18 tháng tuổi
    if (ageInMonths >= 12 && ageInMonths < 18) ageGroups.push('DT03');

    // 12 tháng - dưới 24 tháng tuổi
    if (ageInMonths >= 12 && ageInMonths < 24) ageGroups.push('DT03_DT04');

    // 18 - dưới 24 tháng tuổi
    if (ageInMonths >= 18 && ageInMonths < 24) ageGroups.push('DT04');

    // 24 - dưới 36 tháng tuổi
    if (ageInMonths >= 24 && ageInMonths < 36) ageGroups.push('DT05');

    // 36 - dưới 72 tháng tuổi
    if (ageInMonths >= 36 && ageInMonths < 72) ageGroups.push('DT06');

    // 36 tháng - dưới 72 tháng tuổi
    if (ageInMonths >= 36 && ageInMonths < 72) ageGroups.push('DT06_DT07');

    // 60 - dưới 72 tháng tuổi
    if (ageInMonths >= 60 && ageInMonths < 72) ageGroups.push('DT07');

    // Trên 5 tuổi - dưới 12 tuổi
    if (ageInYears >= 5 && ageInYears < 12) ageGroups.push('DT07_DT10');

    // 5 - dưới 19 tuổi
    if (ageInYears >= 5 && ageInYears < 19) ageGroups.push('DT07_DT12');

    // 72 tháng - dưới 8 tuổi
    if (ageInYears >= 6 && ageInYears < 8) ageGroups.push('DT08');

    // 72 tháng - dưới 12 tuổi
    if (ageInYears >= 6 && ageInYears < 12) ageGroups.push('DT08_DT10');

    // 8 - dưới 10 tuổi
    if (ageInYears >= 8 && ageInYears < 10) ageGroups.push('DT09');

    // 10 - dưới 12 tuổi
    if (ageInYears >= 10 && ageInYears < 12) ageGroups.push('DT10');

    // 12 - 19 tuổi
    if (ageInYears >= 12 && ageInYears < 19) ageGroups.push('DT10_DT11');

    // 12 - dưới 15 tuổi
    if (ageInYears >= 12 && ageInYears < 15) ageGroups.push('DT11');

    // 15 - trên 19 tuổi
    if (ageInYears >= 15 && ageInYears < 19) ageGroups.push('DT12');

    // Trên 15 tuổi
    if (ageInYears >= 15) ageGroups.push('DT12_DT15');

    // Trên 19 tuổi - dưới 31 tuổi
    if (ageInYears >= 19 && ageInYears < 31) ageGroups.push('DT13');

    // 19 - dưới 70 tuổi
    if (ageInYears >= 19 && ageInYears < 70) ageGroups.push('DT13_DT14');

    // 31 - dưới 70 tuổi
    if (ageInYears >= 31 && ageInYears < 70) ageGroups.push('DT14');

    // Trên 70 tuổi
    if (ageInYears >= 70) ageGroups.push('DT15');

    return ageGroups;
  }

  /**
   * Find all age ranges
   */
  async findAll(): Promise<AgeRange[]> {
    return this.find();
  }
}
