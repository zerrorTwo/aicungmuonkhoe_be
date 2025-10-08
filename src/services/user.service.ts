import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { CreateNewUserDto, UpdateUserProfileDto } from 'src/dtos/user.dto';
import { UserRepository } from 'src/repositories/user.repository';
import { HealthDocumentRepository } from 'src/repositories/health-document.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _healthDocumentRepository: HealthDocumentRepository,
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

  async updateUserProfile(userId: number, updateData: UpdateUserProfileDto) {
    // 1. Lấy current user với health document
    const user = await this._userRepository.findUserWithHealthDocuments(userId);
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    // 2. Tìm health document của chính user (IS_MYSELF = 1)
    let myHealthDocument = user.HEALTH_DOCUMENTS?.find(hd => {
      const isMyself = this.isTruthy(hd.IS_MYSELF);
      const isNotDeleted = this.isFalsy(hd.IS_DELETED);
      return isMyself && isNotDeleted;
    });

    // 3. Nếu chưa có health document, tạo mới
    if (!myHealthDocument) {
      const newHealthDoc = {
        USER: user,
        IS_MYSELF: 1, // Use 1 instead of true for MySQL tinyint
        IS_DELETED: 0, // Use 0 instead of false
        FULL_NAME: updateData.fullName || user.EMAIL.split('@')[0],
        PHONE: updateData.phone || user.PHONE || '',
        DOB: updateData.birthDate || '',
        PROVINCE: updateData.address || '',
        AVATAR: updateData.avatar || '',
      } as any;

      // Add gender if provided
      if (updateData.genderId) {
        newHealthDoc.GENDER = { ID: updateData.genderId };
      }

      myHealthDocument = await this._healthDocumentRepository.create(newHealthDoc);
    } else {
      // 4. Merge current data với new data (chỉ update fields thay đổi)
      const updatedFields: any = {};
      let hasChanges = false;

      // Check từng field và chỉ update nếu có thay đổi
      if (updateData.fullName !== undefined && updateData.fullName !== myHealthDocument.FULL_NAME) {
        updatedFields.FULL_NAME = updateData.fullName;
        hasChanges = true;
      }

      if (updateData.phone !== undefined && updateData.phone !== myHealthDocument.PHONE) {
        updatedFields.PHONE = updateData.phone;
        hasChanges = true;
      }

      if (updateData.birthDate !== undefined && updateData.birthDate !== myHealthDocument.DOB) {
        updatedFields.DOB = updateData.birthDate;
        hasChanges = true;
      }

      if (updateData.address !== undefined && updateData.address !== myHealthDocument.PROVINCE) {
        updatedFields.PROVINCE = updateData.address;
        hasChanges = true;
      }

      if (updateData.avatar !== undefined && updateData.avatar !== myHealthDocument.AVATAR) {
        updatedFields.AVATAR = updateData.avatar;
        hasChanges = true;
      }

      if (updateData.genderId !== undefined) {
        const currentGenderId = myHealthDocument.GENDER?.ID;
        if (updateData.genderId !== currentGenderId) {
          updatedFields.GENDER = { ID: updateData.genderId };
          hasChanges = true;
        }
      }

      // 5. Chỉ update nếu có thay đổi
      if (hasChanges) {
        const updatedDoc = await this._healthDocumentRepository.update(myHealthDocument.ID, updatedFields);
        myHealthDocument = updatedDoc;
      }
    }

    // Ensure myHealthDocument exists at this point
    if (!myHealthDocument) {
      throw new Error('Failed to create or update health document');
    }

    // 6. Return updated profile data (similar to getUserProfile)
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
  }
}
