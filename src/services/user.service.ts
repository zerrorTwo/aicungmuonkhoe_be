import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { CreateNewUserDto } from 'src/dtos/user.dto';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly _userRepository: UserRepository) {}

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
    console.log('=== GET USER PROFILE SERVICE ===');
    console.log('userId:', userId);

    // Lấy user với health document và các relations
    const user = await this._userRepository.findUserWithHealthDocuments(userId);

    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    console.log('Found user:', user);
    console.log('Health documents:', user.HEALTH_DOCUMENTS);

    // Lấy health document của chính user (IS_MYSELF = 1 hoặc true)
    const myHealthDocument = user.HEALTH_DOCUMENTS?.find(hd => {
      console.log('Checking health document:', {
        id: hd.ID,
        IS_MYSELF: hd.IS_MYSELF,
        IS_MYSELF_TYPE: typeof hd.IS_MYSELF,
        IS_DELETED: hd.IS_DELETED,
        IS_DELETED_TYPE: typeof hd.IS_DELETED
      });
      
      // Sử dụng utility functions để xử lý boolean
      const isMyself = this.isTruthy(hd.IS_MYSELF);
      const isNotDeleted = this.isFalsy(hd.IS_DELETED);
      
      return isMyself && isNotDeleted;
    });

    console.log('My health document:', myHealthDocument);

    // Tạo response object thuần túy
    const profile = {
      userId: user.USER_ID,
      
      // Tên: Ưu tiên FULL_NAME hoặc NAME từ health document, fallback về email
      fullName: myHealthDocument?.FULL_NAME || 
                myHealthDocument?.NAME || 
                user.EMAIL.split('@')[0] || 
                'Người dùng',
      
      email: user.EMAIL,
      
      // Phone: Ưu tiên health document, fallback về user
      phone: myHealthDocument?.PHONE || user.PHONE || '',
      
      // Ngày sinh từ health document
      birthDate: myHealthDocument?.DOB || '',
      
      // Giới tính từ health document
      gender: myHealthDocument?.GENDER?.NAME || '',
      
      // Địa chỉ từ province trong health document
      address: myHealthDocument?.PROVINCE || '',
      
      // Avatar: Ưu tiên health document, fallback về user
      avatar: myHealthDocument?.AVATAR || user.FACE_IMAGE || '',
      
      // Trạng thái tài khoản
      isActive: this.isTruthy(user.STATUS_ACTIVE),
      isAdmin: this.isTruthy(user.IS_ADMIN),
      
      // Thông tin health document
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

    console.log('Final profile response:', profile);
    return profile;
  }
}
