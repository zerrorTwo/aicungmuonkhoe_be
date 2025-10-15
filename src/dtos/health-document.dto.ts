import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateHealthDocumentDto {
  @ApiPropertyOptional({
    description: 'ID của user (nếu không có sẽ lấy từ token)',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  USER_ID?: number;

  @ApiPropertyOptional({ description: 'Tên hiển thị' })
  @IsOptional()
  @IsString()
  NAME?: string;

  @ApiPropertyOptional({ description: 'Họ tên đầy đủ' })
  @IsOptional()
  @IsString()
  FULL_NAME?: string;

  @ApiPropertyOptional({ description: 'Ngày sinh' })
  @IsOptional()
  @IsString()
  DOB?: string;

  @ApiPropertyOptional({ description: 'Số điện thoại' })
  @IsOptional()
  @IsString()
  PHONE?: string;

  @ApiPropertyOptional({ description: 'Đã liên kết tài khoản', default: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  IS_LINK?: boolean;

  @ApiPropertyOptional({ description: 'Đã đồng bộ', default: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  IS_SYNC?: boolean;

  @ApiPropertyOptional({ description: 'Loại hồ sơ' })
  @IsOptional()
  @IsString()
  TYPE?: string;

  @ApiPropertyOptional({ description: 'Chiều cao (cm)' })
  @IsOptional()
  @IsString()
  HEIGHT?: string;

  @ApiPropertyOptional({ description: 'Cân nặng (kg)' })
  @IsOptional()
  @IsString()
  WEIGHT?: string;

  @ApiPropertyOptional({ description: 'Tình trạng sức khỏe' })
  @IsOptional()
  @IsString()
  HEALTH_STATUS?: string;

  @ApiPropertyOptional({ description: 'Nghề nghiệp' })
  @IsOptional()
  @IsString()
  JOB?: string;

  @ApiPropertyOptional({ description: 'Loại hoạt động' })
  @IsOptional()
  @IsString()
  TYPE_ACTION?: string;

  @ApiPropertyOptional({ description: 'Ngày làm việc' })
  @IsOptional()
  @IsString()
  DATE_WORKDAY?: string;

  @ApiPropertyOptional({ description: 'Ngày nghỉ' })
  @IsOptional()
  @IsString()
  DATE_OFF?: string;

  @ApiPropertyOptional({ description: 'Là bản thân', default: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  IS_MYSELF?: boolean;

  @ApiPropertyOptional({ description: 'Đã cập nhật', default: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  IS_UPDATE?: boolean;

  @ApiPropertyOptional({ description: 'Ảnh đại diện URL' })
  @IsOptional()
  @IsString()
  AVATAR?: string;

  @ApiPropertyOptional({ description: 'Tần suất tập thể dục' })
  @IsOptional()
  @IsString()
  EXERCISE_FREQUENCY?: string;

  @ApiPropertyOptional({ description: 'Tỉnh/Thành phố' })
  @IsOptional()
  @IsString()
  PROVINCE?: string;

  @ApiPropertyOptional({ description: 'ID giới tính' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  GENDER_ID?: number;

  @ApiPropertyOptional({ description: 'ID mức độ tập luyện' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  EXERCISE_INTENSITY_ID?: number;
}

export class UpdateHealthDocumentDto extends PartialType(
  CreateHealthDocumentDto,
) {
  @ApiProperty({ description: 'ID của health document cần cập nhật' })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  ID: number;
}

export class HealthDocumentResponseDto {
  @ApiProperty()
  ID: number;

  @ApiProperty()
  NAME?: string;

  @ApiProperty()
  FULL_NAME?: string;

  @ApiProperty()
  DOB?: string;

  @ApiProperty()
  PHONE?: string;

  @ApiProperty()
  IS_LINK: boolean;

  @ApiProperty()
  IS_SYNC: boolean;

  @ApiProperty()
  TYPE?: string;

  @ApiProperty()
  HEIGHT?: string;

  @ApiProperty()
  WEIGHT?: string;

  @ApiProperty()
  HEALTH_STATUS?: string;

  @ApiProperty()
  JOB?: string;

  @ApiProperty()
  TYPE_ACTION?: string;

  @ApiProperty()
  DATE_WORKDAY?: string;

  @ApiProperty()
  DATE_OFF?: string;

  @ApiProperty()
  IS_MYSELF: boolean;

  @ApiProperty()
  IS_UPDATE: boolean;

  @ApiProperty()
  AVATAR?: string;

  @ApiProperty()
  EXERCISE_FREQUENCY?: string;

  @ApiProperty()
  PROVINCE?: string;

  @ApiProperty({ type: () => Object, description: 'Thông tin user' })
  USER?: {
    user_id: number;
    email: string;
    phone?: string;
  };

  @ApiProperty({ type: () => Object, description: 'Thông tin giới tính' })
  GENDER?: {
    id: number;
    name: string;
    cd?: string;
    desc?: string;
  };

  @ApiProperty({
    type: () => Object,
    description: 'Thông tin mức độ tập luyện',
  })
  EXERCISE_INTENSITY?: {
    id: number;
    code: string;
    displayName: string;
  };
}

export class GetHealthDocumentByUserDto {
  @ApiProperty({ description: 'ID của user' })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  USER_ID: number;
}

export class GetHealthDocumentByIdDto {
  @ApiProperty({ description: 'ID của health document' })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  ID: number;
}
