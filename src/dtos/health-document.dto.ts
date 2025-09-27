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
    @ApiPropertyOptional({ description: 'ID của user (nếu không có sẽ lấy từ token)' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    userId?: number;

    @ApiPropertyOptional({ description: 'Tên hiển thị' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: 'Họ tên đầy đủ' })
    @IsOptional()
    @IsString()
    fullName?: string;

    @ApiPropertyOptional({ description: 'Ngày sinh' })
    @IsOptional()
    @IsString()
    dob?: string;

    @ApiPropertyOptional({ description: 'Số điện thoại' })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional({ description: 'Đã liên kết tài khoản', default: false })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => Boolean(value))
    isLink?: boolean;

    @ApiPropertyOptional({ description: 'Đã đồng bộ', default: false })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => Boolean(value))
    isSync?: boolean;

    @ApiPropertyOptional({ description: 'Loại hồ sơ' })
    @IsOptional()
    @IsString()
    type?: string;

    @ApiPropertyOptional({ description: 'Chiều cao (cm)' })
    @IsOptional()
    @IsString()
    height?: string;

    @ApiPropertyOptional({ description: 'Cân nặng (kg)' })
    @IsOptional()
    @IsString()
    weight?: string;

    @ApiPropertyOptional({ description: 'Tình trạng sức khỏe' })
    @IsOptional()
    @IsString()
    healthStatus?: string;

    @ApiPropertyOptional({ description: 'Nghề nghiệp' })
    @IsOptional()
    @IsString()
    job?: string;

    @ApiPropertyOptional({ description: 'Loại hoạt động' })
    @IsOptional()
    @IsString()
    typeAction?: string;

    @ApiPropertyOptional({ description: 'Ngày làm việc' })
    @IsOptional()
    @IsString()
    dateWorkday?: string;

    @ApiPropertyOptional({ description: 'Ngày nghỉ' })
    @IsOptional()
    @IsString()
    dateOff?: string;

    @ApiPropertyOptional({ description: 'Là bản thân', default: false })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => Boolean(value))
    isMyself?: boolean;

    @ApiPropertyOptional({ description: 'Đã cập nhật', default: false })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => Boolean(value))
    isUpdate?: boolean;

    @ApiPropertyOptional({ description: 'Ảnh đại diện URL' })
    @IsOptional()
    @IsString()
    avatar?: string;

    @ApiPropertyOptional({ description: 'Tần suất tập thể dục' })
    @IsOptional()
    @IsString()
    exerciseFrequency?: string;

    @ApiPropertyOptional({ description: 'Tỉnh/Thành phố' })
    @IsOptional()
    @IsString()
    province?: string;

    @ApiPropertyOptional({ description: 'ID giới tính' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    genderId?: number;

    @ApiPropertyOptional({ description: 'ID mức độ tập luyện' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    exerciseIntensityId?: number;
}

export class UpdateHealthDocumentDto extends PartialType(CreateHealthDocumentDto) {
    @ApiProperty({ description: 'ID của health document cần cập nhật' })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    id: number;
}

export class HealthDocumentResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name?: string;

    @ApiProperty()
    fullName?: string;

    @ApiProperty()
    dob?: string;

    @ApiProperty()
    phone?: string;

    @ApiProperty()
    isLink: boolean;

    @ApiProperty()
    isSync: boolean;

    @ApiProperty()
    type?: string;

    @ApiProperty()
    height?: string;

    @ApiProperty()
    weight?: string;

    @ApiProperty()
    healthStatus?: string;

    @ApiProperty()
    job?: string;

    @ApiProperty()
    typeAction?: string;

    @ApiProperty()
    dateWorkday?: string;

    @ApiProperty()
    dateOff?: string;

    @ApiProperty()
    isMyself: boolean;

    @ApiProperty()
    isUpdate: boolean;

    @ApiProperty()
    avatar?: string;

    @ApiProperty()
    exerciseFrequency?: string;

    @ApiProperty()
    province?: string;

    @ApiProperty({ type: () => Object, description: 'Thông tin user' })
    user?: {
        user_id: number;
        email: string;
        phone?: string;
    };

    @ApiProperty({ type: () => Object, description: 'Thông tin giới tính' })
    gender?: {
        id: number;
        name: string;
        cd?: string;
        desc?: string;
    };

    @ApiProperty({ type: () => Object, description: 'Thông tin mức độ tập luyện' })
    exerciseIntensity?: {
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
    userId: number;
}

export class GetHealthDocumentByIdDto {
    @ApiProperty({ description: 'ID của health document' })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    id: number;
}
