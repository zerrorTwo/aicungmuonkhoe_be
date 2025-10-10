import { Injectable, Logger, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { CreateNewUserDto, UpdateSecuritySetting, UpdateUserProfileDto } from 'src/dtos/user.dto';
import { UserRepository } from 'src/repositories/user.repository';
import { HealthDocumentRepository } from 'src/repositories/health-document.repository';
import { CloudinaryProvider } from '../providers/cloudinary.provider';
import { checkPassword, HashPassword, pickUser } from 'src/utils/auth/common';
import { MailService } from './mail.service';
import { OtpType } from 'src/entities/otp-record.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _healthDocumentRepository: HealthDocumentRepository,
    private readonly cloudinaryProvider: CloudinaryProvider,
    private readonly mailService: MailService
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

  async getUserProfile(userId: number) {
    // Lấy user với health document và các relations
    const user = await this._userRepository.findUserWithHealthDocuments(userId);

    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    // Lấy health document của chính user (IS_MYSELF = 1 hoặc true)
    const myHealthDocument = user.HEALTH_DOCUMENTS?.find(hd => {
      // Sử dụng utility functions để xử lý boolean
      const isMyself = this.isTruthy(hd.IS_MYSELF);
      const isNotDeleted = this.isFalsy(hd.IS_DELETED);
      return isMyself && isNotDeleted;
    });

    // Tạo response object thuần túy
    const profile = {
      userId: user.USER_ID,
      fullName: myHealthDocument?.FULL_NAME || 
                myHealthDocument?.NAME || 
                user.EMAIL.split('@')[0] || 
                'Người dùng',
      email: user.EMAIL,
      phone: myHealthDocument?.PHONE || user.PHONE || '',
      birthDate: myHealthDocument?.DOB || '',
      gender: myHealthDocument?.GENDER?.NAME || '',
      address: myHealthDocument?.PROVINCE || '',
      avatar: myHealthDocument?.AVATAR || user.FACE_IMAGE || '',
      isActive: this.isTruthy(user.STATUS_ACTIVE),
      isAdmin: this.isTruthy(user.IS_ADMIN),
      healthDocument: myHealthDocument ? {
        id: myHealthDocument.ID,
        height: myHealthDocument.HEIGHT,
        weight: myHealthDocument.WEIGHT,
        healthStatus: myHealthDocument.HEALTH_STATUS,
        exerciseFrequency: myHealthDocument.EXERCISE_FREQUENCY,
        isCompleted: true
      } : {
        isCompleted: false
      }
    };

    return profile;
  }

  async updateUserAvatar(userId: number, avatarFile: Express.Multer.File) {
    // 1. Validate avatar file
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(avatarFile.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
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
    const cloudinaryResult = await this.cloudinaryProvider.uploadStream(avatarFile, 'avatarHealth');
    const avatarUrl = cloudinaryResult.secure_url;

    // 4. Update User.FACE_IMAGE
    await this._userRepository.updateFaceImage(userId, avatarUrl);
    

    // 5. Find and update health document
    let myHealthDocument = user.HEALTH_DOCUMENTS?.find(hd => {
      const isMyself = this.isTruthy(hd.IS_MYSELF);
      const isNotDeleted = this.isFalsy(hd.IS_DELETED);
      return isMyself && isNotDeleted;
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

      myHealthDocument = await this._healthDocumentRepository.create(newHealthDoc);
      
    } else {
      // Update existing health document
      const updatedDoc = await this._healthDocumentRepository.update(myHealthDocument.ID, { AVATAR: avatarUrl });
      myHealthDocument = updatedDoc;
      
    }

    // 6. Return updated profile data
    const updatedProfile = {
      userId: user.USER_ID,
      fullName: myHealthDocument.FULL_NAME || user.EMAIL.split('@')[0] || 'Người dùng',
      email: user.EMAIL,
      phone: myHealthDocument.PHONE || user.PHONE || '',
      birthDate: myHealthDocument.DOB || '',
      gender: myHealthDocument.GENDER?.NAME || '',
      address: myHealthDocument.PROVINCE || '',
      avatar: avatarUrl, // Always use the new avatar URL
      isActive: this.isTruthy(user.STATUS_ACTIVE),
      isAdmin: this.isTruthy(user.IS_ADMIN),
      healthDocument: {
        id: myHealthDocument.ID,
        height: myHealthDocument.HEIGHT,
        weight: myHealthDocument.WEIGHT,
        healthStatus: myHealthDocument.HEALTH_STATUS,
        exerciseFrequency: myHealthDocument.EXERCISE_FREQUENCY,
        isCompleted: true
      }
    };

    return updatedProfile;
  }

  async updateUserProfile(userId: number, updateData: UpdateUserProfileDto, avatarFile?: Express.Multer.File) {
   

    try {
      // 1. Lấy current user với health document
      const user = await this._userRepository.findUserWithHealthDocuments(userId);
      if (!user) {
        throw new Error(`User with id ${userId} not found`);
      }

      // 2. Xử lý avatar file nếu có - call CloudinaryProvider để upload
      let finalUpdateData = { ...updateData };
      if (avatarFile) {
        
        const cloudinaryResult = await this.cloudinaryProvider.uploadStream(avatarFile, 'avatarHealth');
        const avatarUrl = cloudinaryResult.secure_url;
        
        // Thêm avatar URL vào data để update
        finalUpdateData.avatar = avatarUrl;
        
        
        // Đồng bộ User.FACE_IMAGE
        await this._userRepository.updateFaceImage(userId, avatarUrl);
        
      }

      // 3. Tìm health document của chính user (IS_MYSELF = 1)
      let myHealthDocument = user.HEALTH_DOCUMENTS?.find(hd => {
        const isMyself = this.isTruthy(hd.IS_MYSELF);
        const isNotDeleted = this.isFalsy(hd.IS_DELETED);
        return isMyself && isNotDeleted;
      });

      // 4. Nếu chưa có health document, tạo mới
      if (!myHealthDocument) {
        const newHealthDoc = {
          USER: user,
          IS_MYSELF: 1, 
          IS_DELETED: 0, 
          FULL_NAME: finalUpdateData.fullName || user.EMAIL.split('@')[0],
          PHONE: finalUpdateData.phone || user.PHONE || '',
          DOB: finalUpdateData.birthDate || '',
          PROVINCE: finalUpdateData.address || '',
          AVATAR: finalUpdateData.avatar || '',
        } as any;

        if (finalUpdateData.genderId) {
          newHealthDoc.GENDER = { ID: finalUpdateData.genderId };
        }

        myHealthDocument = await this._healthDocumentRepository.create(newHealthDoc);
        
      } else {
        // 5. Update existing health document
        const updatedFields: any = {};
        let hasChanges = false;

        if (finalUpdateData.fullName !== undefined && finalUpdateData.fullName !== myHealthDocument.FULL_NAME) {
          updatedFields.FULL_NAME = finalUpdateData.fullName;
          hasChanges = true;
        }

        if (finalUpdateData.phone !== undefined && finalUpdateData.phone !== myHealthDocument.PHONE) {
          updatedFields.PHONE = finalUpdateData.phone;
          hasChanges = true;
        }

        if (finalUpdateData.birthDate !== undefined && finalUpdateData.birthDate !== myHealthDocument.DOB) {
          updatedFields.DOB = finalUpdateData.birthDate;
          hasChanges = true;
        }

        if (finalUpdateData.address !== undefined && finalUpdateData.address !== myHealthDocument.PROVINCE) {
          updatedFields.PROVINCE = finalUpdateData.address;
          hasChanges = true;
        }

        if (finalUpdateData.avatar !== undefined && finalUpdateData.avatar !== myHealthDocument.AVATAR) {
          updatedFields.AVATAR = finalUpdateData.avatar;
          hasChanges = true;
        }

        if (finalUpdateData.genderId !== undefined) {
          const currentGenderId = myHealthDocument.GENDER?.ID;
          if (finalUpdateData.genderId !== currentGenderId) {
            updatedFields.GENDER = { ID: finalUpdateData.genderId };
            hasChanges = true;
          }
        }

        if (hasChanges) {
          const updatedDoc = await this._healthDocumentRepository.update(myHealthDocument.ID, updatedFields);
          myHealthDocument = updatedDoc;
          
        }
      }

      if (!myHealthDocument) {
        throw new Error('Failed to create or update health document');
      }

      // 6. Return updated profile data
      const updatedProfile = {
        userId: user.USER_ID,
        fullName: myHealthDocument.FULL_NAME || user.EMAIL.split('@')[0] || 'Người dùng',
        email: user.EMAIL,
        phone: myHealthDocument.PHONE || user.PHONE || '',
        birthDate: myHealthDocument.DOB || '',
        gender: myHealthDocument.GENDER?.NAME || '',
        address: myHealthDocument.PROVINCE || '',
        avatar: myHealthDocument.AVATAR || user.FACE_IMAGE || '',
        isActive: this.isTruthy(user.STATUS_ACTIVE),
        isAdmin: this.isTruthy(user.IS_ADMIN),
        healthDocument: {
          id: myHealthDocument.ID,
          height: myHealthDocument.HEIGHT,
          weight: myHealthDocument.WEIGHT,
          healthStatus: myHealthDocument.HEALTH_STATUS,
          exerciseFrequency: myHealthDocument.EXERCISE_FREQUENCY,
          isCompleted: true
        }
      };

     

      return updatedProfile;

    } catch (error) {
      this.logger.error('Error updating profile:', error);
      throw new Error(`Không thể cập nhật profile: ${error.message}`);
    }
  }

  async updateUserSecuritySettings(userId: number, data: UpdateSecuritySetting) {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.IS_DELETED) {
      throw new Error('User account is deleted');
    }

    let updatedUser : any;
    
    // Kiểm tra các trường, nếu có trường nào thì cập nhật trường đó
    if (data.PHONE) {
      // Check OTP từ email đã gửi
      const otpResult = await this.mailService.verifyEmail(user.EMAIL, data.OTP_CODE || '');
      if (!otpResult.success) {
        throw new Error(`OTP verification failed: ${otpResult.message}`);
      }
      
      // Tiến hành cho phép thay đổi số điện thoại
      updatedUser = await this._userRepository.update(userId, {
        ...user,
        PHONE: data.PHONE,
        UPDATED_AT: new Date()
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
        UPDATED_AT: new Date() 
      });
      
    } else if (data.EMAIL) {
      // Check OTP từ email đã gửi
      const otpResult = await this.mailService.verifyEmail(user.EMAIL, data.OTP_CODE || '');
      if (!otpResult.success) {
        throw new Error(`OTP verification failed: ${otpResult.message}`);
      }
      
      // Tiến hành cho phép thay đổi email
      updatedUser = await this._userRepository.update(userId, { 
        ...user, 
        EMAIL: data.EMAIL, 
        UPDATED_AT: new Date() 
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
      throw new UnauthorizedException('Email not activated. Please activate your email before resetting password.');
    }

    // 3. Tạo mã OTP, save vào cơ sở dữ liệu và gửi email
    await this.mailService.sendVerificationEmail(user.USER_ID.toString(), OtpType.FORGOT_PASSWORD);

    return {
      success: true,
      message: 'OTP sent to email if it exists in our system'
    }
  }

  async resetPassword(email: string, otpCode: string, newPassword: string) {
    // 1. Tìm user theo email
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    // 2. check mail đã active chưa
    if (user.STATUS_ACTIVE !== 1) {
      throw new UnauthorizedException('Email not activated. Please activate your email before resetting password.');
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
        UPDATED_AT: new Date() 
      });

    return {
      success: true,
      message: 'Password reset successfully'
    };
  }
}
