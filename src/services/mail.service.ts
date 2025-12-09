import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import loadEnv from '../utils/configs/configuration';
import { SendVerificationDto } from 'src/dtos/mail.dto';
import { UserRepository } from 'src/repositories/user.repository';
import { OtpRepository } from 'src/repositories/otp.repository';
import { OtpStatus, OtpType } from 'src/entities/otp-record.entity';
import {
  generateOtpCode,
  generateOtpExpiry,
  isOtpExpired,
} from 'src/utils/otp';

const env = loadEnv();
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;
  private readonly MAX_VERIFY_ATTEMPTS = 4;

  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly userRepository: UserRepository,
  ) {
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: env.GMAIL_USER,
        pass: env.GMAIL_PASSWORD,
      },
    });
  }

  /**
   * Send verification email with OTP
   */
  async sendVerificationEmail(userId: string, type: OtpType): Promise<void> {
    const idNumber = parseInt(userId, 10);
    const user = await this.userRepository.findById(idNumber);
    console.log(user);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate new OTP
    const otpCode = generateOtpCode();
    const expiryTime = generateOtpExpiry(5); // 5 minutes

    // Save OTP to database
    await this.otpRepository.create({
      USER_ID_MNMN: user.USER_ID,
      PHONE_NUMBER: user.PHONE || '', // Store user's current phone for reference
      OTP_CODE: otpCode,
      EXPIRES_AT: expiryTime,
      STATUS: OtpStatus.PENDING,
      TYPE: type,
      SENT_COUNT: 1,
    });
    const mailOptions = {
      from: env.GMAIL_USER,
      to: user.EMAIL,
      subject: 'Xác nhận địa chỉ email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c5aa0;">Xác nhận địa chỉ email</h2>
          <p>Xin chào,</p>
          <p>Bạn đã yêu cầu xác nhận địa chỉ email này. Vui lòng sử dụng mã OTP bên dưới:</p>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #2c5aa0; font-size: 32px; margin: 0; letter-spacing: 5px;">${otpCode}</h1>
          </div>
          <p><strong>Lưu ý:</strong> Mã OTP này có hiệu lực trong <strong>5 phút</strong>.</p>
          <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #6c757d; font-size: 12px;">
            Email này được gửi tự động từ hệ thống. Vui lòng không trả lời email này.
          </p>
        </div>
  `,
    };
    await this.transporter.sendMail(mailOptions);
  }

  /**
   * Send phone verification SMS (placeholder - would integrate with SMS service)
   */
  async sendVerificationPhone(userId: string, otpType: OtpType): Promise<void> {
    const idNumber = parseInt(userId, 10);
    const user = await this.userRepository.findById(idNumber);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate new OTP
    const otpCode = generateOtpCode();
    const expiryTime = generateOtpExpiry(5); // 5 minutes

    // Save OTP to database
    await this.otpRepository.create({
      USER_ID_MNMN: user.USER_ID,
      PHONE_NUMBER: user.PHONE || '', // Store user's current phone for reference
      OTP_CODE: otpCode,
      EXPIRES_AT: expiryTime,
      STATUS: OtpStatus.PENDING,
      TYPE: otpType,
      SENT_COUNT: 1,
    });

    const mailOptions = {
      from: env.GMAIL_USER,
      to: user.EMAIL || '',
      subject: 'Xác nhận số điện thoại',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c5aa0;">Xác nhận số điện thoại</h2>
          <p>Xin chào,</p>
          <p>Bạn đã yêu cầu xác nhận OTP để thay đổi số điện thoại. Vui lòng sử dụng mã OTP bên dưới:</p>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #2c5aa0; font-size: 32px; margin: 0; letter-spacing: 5px;">${otpCode}</h1>
          </div>
          <p><strong>Lưu ý:</strong> Mã OTP này có hiệu lực trong <strong>5 phút</strong>.</p>
          <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #6c757d; font-size: 12px;">
            Email này được gửi tự động từ hệ thống. Vui lòng không trả lời email này.
          </p>
        </div>
  `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  /**
   * Send phone verification SMS (placeholder - would integrate with SMS service)
   */
  async sendVerification(
    data: SendVerificationDto
  ): Promise<string> {
    const { USER_ID,PHONE, EMAIL, OTP_TYPE } = data;
    if (!PHONE && !EMAIL) {
      throw new Error('Either phone or email must be provided');
    }
    if (PHONE && EMAIL) {
      throw new Error('Please provide either phone or email, not both');
    }
    if (PHONE) {
      await this.sendVerificationPhone(USER_ID, OTP_TYPE);
    } else if (EMAIL) {
      const result = await this.userRepository.findByEmail(EMAIL);
      if (result) {
        await this.sendVerificationEmail(result.USER_ID.toString(), OTP_TYPE);
      } else if(USER_ID){
        await this.sendVerificationEmail(USER_ID, OTP_TYPE);
      } else {
        throw new NotFoundException('User not found');
      }
    }

    return 'Send code successfully!!';
  }

  /**
   * Test email configuration
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('Mail service connection verified successfully');
      return true;
    } catch (error) {
      this.logger.error('Mail service connection failed:', error);
      return false;
    }
  }

  /**
   * Verify email OTP
   */
  async verifyEmail(
    email: string,
    code: string,
  ): Promise<{ success: boolean; message: string }> {
    // Find OTP record
    const otpRecord = await this.otpRepository.findByEmailAndCode(email, code);
    if (!otpRecord) {
      throw new BadRequestException('Invalid verification code');
    }

    // Check if OTP is expired
    if (isOtpExpired(otpRecord.EXPIRES_AT)) {
      await this.otpRepository.updateStatus(otpRecord.ID, OtpStatus.EXPIRED);
      throw new BadRequestException('Verification code has expired');
    }

    // Check verification attempts
    const attemptCount = await this.otpRepository.countVerificationAttempts(
      otpRecord.PHONE_NUMBER,
      code,
    );

    if (attemptCount >= this.MAX_VERIFY_ATTEMPTS) {
      await this.otpRepository.updateStatus(otpRecord.ID, OtpStatus.EXPIRED);
      throw new BadRequestException('Maximum verification attempts exceeded');
    }

    // Mark OTP as verified
    await this.otpRepository.updateStatus(otpRecord.ID, OtpStatus.VERIFIED);

    // Here you can add logic to update user's email if this was for email change
    // await this.userRepository.updateEmail(otpRecord.USER_ID_MNMN, newEmail);

    this.logger.log(`Email verification successful for: ${email}`);

    return {
      success: true,
      message: 'Email verified successfully',
    };
  }

  /**
   * Cleanup expired OTPs (can be called by cron job)
   */
  async cleanupExpiredOtps(): Promise<void> {
    await this.otpRepository.deleteExpiredOtps();
    this.logger.log('Expired OTPs cleaned up');
  }
}
