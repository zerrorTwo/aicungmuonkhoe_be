import {
  Injectable,
  Logger,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import {
  CreateNewUserDto,
  UpdateSecuritySetting,
  UpdateUserProfileDto,
} from 'src/dtos/user.dto';
import { UserRepository } from 'src/repositories/user.repository';
import { HealthDocumentRepository } from 'src/repositories/health-document.repository';
import { CloudinaryProvider } from '../providers/cloudinary.provider';
import { checkPassword, HashPassword, pickUser } from 'src/utils/auth/common';
import { MailService } from './mail.service';
import { OtpType } from 'src/entities/otp-record.entity';
import { ProvinceRepository } from 'src/repositories/province.repository';
import { HealthDocument } from 'src/entities/health-document.entity';
import { DeepPartial } from 'typeorm';
import { Gender } from 'src/entities/gender.entity';
import { UpdateUserResponse, UserResponse, UserProfileResponse } from 'src/interfaces/user.interface';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _healthDocumentRepository: HealthDocumentRepository,
    private readonly _provinceRepository: ProvinceRepository,
    private readonly cloudinaryProvider: CloudinaryProvider,
    private readonly mailService: MailService,
  ) {}

  // Utility function để xử lý boolean từ database (tinyint có thể trả về 0/1 hoặc true/false)
  private isTruthy(value: any): boolean {
    return value === true || value === 1;
  }

  private isFalsy(value: any): boolean {
    return value === false || value === 0;
  }

  async createEmployee(user: CreateNewUserDto) {
    return this._userRepository.create(user);
  }

  async findUserByID(id: number): Promise<User> {
    const user = await this._userRepository.findById(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }

  async getUserProfile(userId: number): Promise<UserProfileResponse> {
    // Lấy user với health document và các relations
    const user = await this._userRepository.findUserWithHealthDocuments(userId);

    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    // Lấy health document của chính user (IS_MYSELF = 1 hoặc true)
    const myHealthDocument = user.HEALTH_DOCUMENTS?.find((hd) => {
      // Sử dụng utility functions để xử lý boolean
      const isMyself = this.isTruthy(hd.IS_MYSELF);
      return isMyself;
    });

    // Tạo response object theo interface UserProfileResponse
    const profile = {
      USER_ID: user.USER_ID,
      FULL_NAME:
        myHealthDocument?.FULL_NAME ||
        myHealthDocument?.NAME ||
        user.EMAIL.split('@')[0] ||
        'Người dùng',
      EMAIL: user.EMAIL,
      PHONE: myHealthDocument?.PHONE || user.PHONE || '',
      DOB: myHealthDocument?.DOB || '',
      GENDER: myHealthDocument?.GENDER?.NAME || '',
      PROVINCE: myHealthDocument?.PROVINCE?.NAME_WITH_TYPE || null,
      PROVINCE_ID: myHealthDocument?.PROVINCE?.PROVINCE_ID || null,
      AVATAR: myHealthDocument?.AVATAR || user.FACE_IMAGE || '',
      IS_ACTIVE: this.isTruthy(user.STATUS_ACTIVE),
      IS_ADMIN: this.isTruthy(user.IS_ADMIN),
      HEALTH_DOCUMENT: myHealthDocument
        ? {
            ID: myHealthDocument.ID,
            HEIGHT: myHealthDocument.HEIGHT,
            WEIGHT: myHealthDocument.WEIGHT,
            HEALTH_STATUS: myHealthDocument.HEALTH_STATUS,
            EXERCISE_FREQUENCY: myHealthDocument.EXERCISE_FREQUENCY
          }
        : undefined,
    };

    return profile;
  }

  async updateUserAvatar(userId: number, avatarFile: Express.Multer.File): Promise<UpdateUserResponse> {
    // 1. Validate avatar file
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];
    if (!allowedMimeTypes.includes(avatarFile.mimetype)) {
      throw new Error(
        'Invalid file type. Only JPEG, PNG, and WebP images are allowed.',
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (avatarFile.size > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    // 2. Get user with health documents
    const user = await this._userRepository.findUserWithHealthDocuments(userId);
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    // 3. Upload to Cloudinary
    const cloudinaryResult = await this.cloudinaryProvider.uploadStream(
      avatarFile,
      'avatarHealth',
    );
    const avatarUrl = cloudinaryResult.secure_url;

    // 4. Update User.FACE_IMAGE
    await this._userRepository.updateFaceImage(userId, avatarUrl);

    // 5. Find and update health document
    let myHealthDocument = user.HEALTH_DOCUMENTS?.find((hd) => {
      const isMyself = this.isTruthy(hd.IS_MYSELF);
      return isMyself;
    });

    if (!myHealthDocument) {
      // Create new health document with avatar
      const newHealthDoc = {
        USER: user,
        IS_MYSELF: 1,
        IS_DELETED: 0,
        FULL_NAME: user.EMAIL.split('@')[0],
        PHONE: user.PHONE || '',
        AVATAR: avatarUrl,
      } as any;

      myHealthDocument =
        await this._healthDocumentRepository.create(newHealthDoc);
    } else {
      // Update existing health document
      const updatedDoc = await this._healthDocumentRepository.update(
        myHealthDocument.ID,
        { AVATAR: avatarUrl },
      );
      myHealthDocument = updatedDoc;
    }

    // 6. Return updated profile data theo DTO userProfileResponseDto
    const updatedProfile = {
      USER_ID: user.USER_ID,
      FULL_NAME:
        myHealthDocument.FULL_NAME || user.EMAIL.split('@')[0] || 'Người dùng',
      EMAIL: user.EMAIL,
      PHONE: myHealthDocument.PHONE || user.PHONE || '',
      DOB: myHealthDocument.DOB || '',
      GENDER: myHealthDocument.GENDER?.NAME || '',
      PROVINCE: myHealthDocument.PROVINCE?.NAME || '',
      PROVINCE_ID: myHealthDocument.PROVINCE?.PROVINCE_ID || null,
      AVATAR: avatarUrl, // Always use the new avatar URL
      IS_ACTIVE: this.isTruthy(user.STATUS_ACTIVE),
      IS_ADMIN: this.isTruthy(user.IS_ADMIN),
      HEALTH_DOCUMENT: {
        ID: myHealthDocument.ID,
        HEIGHT: myHealthDocument.HEIGHT,
        WEIGHT: myHealthDocument.WEIGHT,
        HEALTH_STATUS: myHealthDocument.HEALTH_STATUS,
        EXERCISE_FREQUENCY: myHealthDocument.EXERCISE_FREQUENCY,
      },
    };

    return updatedProfile;
  }

async updateUserProfile(userId: number, updateData: UpdateUserProfileDto): Promise<UpdateUserResponse> {
  // 1️ Lấy user cùng health document
  const user = await this._userRepository.findUserWithHealthDocuments(userId);
  if (!user) throw new NotFoundException(`User with id ${userId} not found`);

  // 2️ Lấy dữ liệu tỉnh (nếu có)
  const province = updateData.PROVINCE_ID
    ? await this._provinceRepository.findById(updateData.PROVINCE_ID)
    : null;

  // 3️  Tìm health document của chính user (IS_MYSELF = 1)
  let myHealthDocument = user.HEALTH_DOCUMENTS?.find(
    (hd) => this.isTruthy(hd.IS_MYSELF),
  );

  // 4️ Nếu chưa có thì tạo mới
  if (!myHealthDocument) {
    const newHealthDoc: DeepPartial<HealthDocument> = {
      USER: user,
      IS_MYSELF: true,
      FULL_NAME: updateData.FULL_NAME || user.EMAIL.split('@')[0],
      PHONE: updateData.PHONE || user.PHONE || '',
      DOB: updateData.DOB || '',
      PROVINCE: province || undefined,
      GENDER: updateData.GENDER_ID ? ({ ID: updateData.GENDER_ID } as DeepPartial<Gender>) : undefined,
    };

    myHealthDocument = await this._healthDocumentRepository.create(newHealthDoc as any);
  } else {
    // 5️ Nếu có rồi → chỉ update những field có thay đổi
    const updatedFields: Partial<typeof myHealthDocument> = {}; // Tạo một object updatedFields rỗng ban đầu, nhưng nó chỉ được phép chứa các field có trong myHealthDocument, và mỗi field là tùy chọn.

    if (
      updateData.FULL_NAME &&
      updateData.FULL_NAME !== myHealthDocument.FULL_NAME
    ) {
      updatedFields.FULL_NAME = updateData.FULL_NAME;
    }

    if (
      updateData.PHONE &&
      updateData.PHONE !== myHealthDocument.PHONE
    ) {
      updatedFields.PHONE = updateData.PHONE;
    }

    if (
      updateData.DOB &&
      updateData.DOB !== myHealthDocument.DOB
    ) {
      updatedFields.DOB = updateData.DOB;
    }

    if (
      province &&
      province.PROVINCE_ID !== myHealthDocument.PROVINCE?.PROVINCE_ID
    ) {
      updatedFields.PROVINCE = province;
    }

    if (
      updateData.GENDER_ID &&
      updateData.GENDER_ID !== myHealthDocument.GENDER?.ID
    ) {
      updatedFields.GENDER = { ID: updateData.GENDER_ID } as any;
    }

    // Nếu có thay đổi thì update
    if (Object.keys(updatedFields).length > 0) {
      myHealthDocument = await this._healthDocumentRepository.update(
        myHealthDocument.ID,
        updatedFields,
      );
    }
  }

  if (!myHealthDocument)
    throw new Error('Failed to create or update health document');

  // 6️ Chuẩn hoá dữ liệu trả về
  const updatedProfile = {
    USER_ID: user.USER_ID,
    FULL_NAME:
      myHealthDocument.FULL_NAME || user.EMAIL.split('@')[0] || 'Người dùng',
    EMAIL: user.EMAIL,
    PHONE: myHealthDocument.PHONE || user.PHONE || '',
    DOB: myHealthDocument.DOB || '',
    GENDER: myHealthDocument.GENDER?.NAME || '',
    PROVINCE: myHealthDocument.PROVINCE?.NAME || '',
    PROVINCE_ID: myHealthDocument.PROVINCE?.PROVINCE_ID || null,
    AVATAR: myHealthDocument.AVATAR || user.FACE_IMAGE || '',
    IS_ACTIVE: this.isTruthy(user.STATUS_ACTIVE),
    IS_ADMIN: this.isTruthy(user.IS_ADMIN),
    HEALTH_DOCUMENT: {
      ID: myHealthDocument.ID,
      HEIGHT: myHealthDocument.HEIGHT,
      WEIGHT: myHealthDocument.WEIGHT,
      HEALTH_STATUS: myHealthDocument.HEALTH_STATUS,
      EXERCISE_FREQUENCY: myHealthDocument.EXERCISE_FREQUENCY,
    },
  };

  return updatedProfile;
}


  async updateUserSecuritySettings(
    userId: number,
    data: UpdateSecuritySetting,
  ): Promise<UserResponse> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.IS_DELETED) {
      throw new Error('User account is deleted');
    }

    let updatedUser: any;

    // Kiểm tra các trường, nếu có trường nào thì cập nhật trường đó
    if (data.PHONE) {
      // Check OTP từ email đã gửi
      const otpResult = await this.mailService.verifyEmail(
        user.EMAIL,
        data.OTP_CODE || '',
      );
      if (!otpResult.success) {
        throw new Error(`OTP verification failed: ${otpResult.message}`);
      }

      // Tiến hành cho phép thay đổi số điện thoại
      updatedUser = await this._userRepository.update(userId, {
        ...user,
        PHONE: data.PHONE,
        UPDATED_AT: new Date(),
      });
    } else if (data.NEW_PASSWORD && data.CURRENT_PASSWORD) {
      const isValid = await checkPassword(data.CURRENT_PASSWORD, user.PASSWORD);

      if (!isValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      const hashedPassword = await HashPassword(data.NEW_PASSWORD);

      updatedUser = await this._userRepository.update(userId, {
        ...user,
        PASSWORD: hashedPassword,
        UPDATED_AT: new Date(),
      });
    } else if (data.EMAIL) {
      // Check OTP từ email đã gửi
      const otpResult = await this.mailService.verifyEmail(
        user.EMAIL,
        data.OTP_CODE || '',
      );
      if (!otpResult.success) {
        throw new Error(`OTP verification failed: ${otpResult.message}`);
      }

      // Tiến hành cho phép thay đổi email
      updatedUser = await this._userRepository.update(userId, {
        ...user,
        EMAIL: data.EMAIL,
        UPDATED_AT: new Date(),
      });
    } else {
      throw new Error('No valid update data provided');
    }

    return pickUser(updatedUser);
  }

  async forgotPassword(email: string) {
    // 1. Tìm user theo email
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    // 2. check mail đã active chưa
    if (user.STATUS_ACTIVE !== 1) {
      throw new UnauthorizedException(
        'Email not activated. Please activate your email before resetting password.',
      );
    }

    // 3. Tạo mã OTP, save vào cơ sở dữ liệu và gửi email
    await this.mailService.sendVerificationEmail(
      user.USER_ID.toString(),
      OtpType.FORGOT_PASSWORD,
    );

    return {
      success: true,
      message: 'OTP sent to email if it exists in our system',
    };
  }

  async resetPassword(email: string, otpCode: string, newPassword: string) {
    // 1. Tìm user theo email
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    // 2. check mail đã active chưa
    if (user.STATUS_ACTIVE !== 1) {
      throw new UnauthorizedException(
        'Email not activated. Please activate your email before resetting password.',
      );
    }

    // 3. Kiểm tra mã OTP
    const isValidOtp = await this.mailService.verifyEmail(email, otpCode);
    if (!isValidOtp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // 4. Cập nhật mật khẩu
    const hashedPassword = await HashPassword(newPassword);
    await this._userRepository.update(user.USER_ID, {
      ...user,
      PASSWORD: hashedPassword,
      UPDATED_AT: new Date(),
    });

    return {
      success: true,
      message: 'Password reset successfully',
    };
  }
}
