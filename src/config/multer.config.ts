import { Injectable } from '@nestjs/common';
import {
  MulterOptionsFactory,
  MulterModuleOptions,
} from '@nestjs/platform-express';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: undefined, // Sử dụng memory storage để có buffer
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
      fileFilter: (req, file, callback) => {
        // Chỉ accept image files
        const allowedMimeTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              'Chỉ chấp nhận file ảnh định dạng JPG, JPEG, PNG, WEBP',
            ),
            false,
          );
        }

        // Kiểm tra tên file
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
          return callback(
            new BadRequestException('Định dạng file không hợp lệ'),
            false,
          );
        }

        callback(null, true);
      },
    };
  }
}
