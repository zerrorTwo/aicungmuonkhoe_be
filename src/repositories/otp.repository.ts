import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtpRecord, OtpStatus, OtpType } from 'src/entities/otp-record.entity';

@Injectable()
export class OtpRepository {
  constructor(
    @InjectRepository(OtpRecord)
    private readonly otpRepository: Repository<OtpRecord>,
  ) {}

  /**
   * Create new OTP record
   */
  async create(otpData: Partial<OtpRecord>): Promise<OtpRecord> {
    const otp = this.otpRepository.create(otpData);
    return await this.otpRepository.save(otp);
  }

  /**
   * Find OTP by phone number and code
   */
  async findByPhoneAndCode(phoneNumber: string, otpCode: string): Promise<OtpRecord | null> {
    return await this.otpRepository.findOne({
      where: {
        PHONE_NUMBER: phoneNumber,
        OTP_CODE: otpCode,
        STATUS: OtpStatus.PENDING
      },
      relations: ['USER']
    });
  }

  /**
   * Find OTP by email (through user relation) and code
   */
  async findByEmailAndCode(email: string, otpCode: string): Promise<OtpRecord | null> {
    return await this.otpRepository
      .createQueryBuilder('otp')
      .leftJoinAndSelect('otp.USER_ID_MNMN', 'user')
      .where('user.EMAIL = :email', { email })
      .andWhere('otp.OTP_CODE = :otpCode', { otpCode })
      .andWhere('otp.STATUS = :status', { status: OtpStatus.PENDING })
      .getOne();
  }

  /**
   * Count verification attempts for phone number
   */
  async countVerificationAttempts(phoneNumber: string, otpCode: string): Promise<number> {
    return await this.otpRepository.count({
      where: {
        PHONE_NUMBER: phoneNumber,
        OTP_CODE: otpCode
      }
    });
  }

  /**
   * Update OTP status
   */
  async updateStatus(id: number, status: OtpStatus): Promise<void> {
    await this.otpRepository.update(id, { STATUS: status });
  }

  /**
   * Increment sent count
   */
  async incrementSentCount(id: number): Promise<void> {
    await this.otpRepository.increment({ ID: id }, 'SENT_COUNT', 1);
  }

  /**
   * Find active OTP by user ID and type
   */
  async findActiveOtpByUser(userId: number, type: OtpType): Promise<OtpRecord | null> {
    return await this.otpRepository.findOne({
      where: {
        USER_ID_MNMN: userId,
        TYPE: type,
        STATUS: OtpStatus.PENDING
      }
    });
  }

 

  /**
   * Delete expired OTPs (cleanup)
   */
  async deleteExpiredOtps(): Promise<void> {
    const now = new Date();
    await this.otpRepository
      .createQueryBuilder()
      .delete()
      .from(OtpRecord)
      .where('EXPIRES_AT < :now', { now })
      .execute();
  }
}