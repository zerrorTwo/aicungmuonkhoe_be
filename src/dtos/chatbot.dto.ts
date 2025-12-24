import {
  IsString,
  IsOptional,
  IsObject,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ChatbotIntentEnum {
  BMI_INQUIRY = 'BMI_INQUIRY',
  BLOOD_PRESSURE_INQUIRY = 'BLOOD_PRESSURE_INQUIRY',
  BLOOD_SUGAR_INQUIRY = 'BLOOD_SUGAR_INQUIRY',
  GENERAL_HEALTH_INQUIRY = 'GENERAL_HEALTH_INQUIRY',
  HEALTH_ADVICE = 'HEALTH_ADVICE',
  UNKNOWN = 'UNKNOWN',
}

export class ChatMessageDto {
  @ApiProperty({
    description: 'Tin nhắn từ người dùng',
    example: 'Chỉ số BMI của tôi là bao nhiêu?',
  })
  @IsString()
  message: string;

  @ApiPropertyOptional({
    description: 'Dữ liệu sức khỏe của user (nếu có)',
    example: {
      weight: 70,
      height: 170,
      age: 25,
      gender: 'nam',
    },
  })
  @IsOptional()
  @IsObject()
  healthData?: {
    weight?: number;
    height?: number;
    age?: number;
    gender?: string;
    bloodPressureSys?: number;
    bloodPressureDia?: number;
    bloodSugar?: number;
    [key: string]: any;
  };

  @ApiPropertyOptional({
    description: 'ID user để lấy lịch sử chat',
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({
    description: 'ID conversation để theo dõi ngữ cảnh',
  })
  @IsOptional()
  @IsString()
  conversationId?: string;
}

export class ChatResponseDto {
  @ApiProperty({
    description: 'Câu trả lời từ chatbot',
    example:
      'Dựa trên chiều cao 170cm và cân nặng 70kg, chỉ số BMI của bạn là 24.22...',
  })
  message: string;

  @ApiProperty({
    description: 'Intent được phát hiện',
    enum: ChatbotIntentEnum,
    example: ChatbotIntentEnum.BMI_INQUIRY,
  })
  intent: ChatbotIntentEnum;

  @ApiPropertyOptional({
    description: 'Dữ liệu tính toán (nếu có)',
    example: {
      bmi: 24.22,
      conclusion: 'Bình thường',
      recommend: 'Duy trì chế độ ăn uống lành mạnh',
    },
  })
  @IsOptional()
  @IsObject()
  data?: any;

  @ApiPropertyOptional({
    description: 'ID conversation',
  })
  @IsOptional()
  @IsString()
  conversationId?: string;

  @ApiProperty({
    description: 'Timestamp',
    example: '2025-12-21T10:30:00Z',
  })
  timestamp: Date;
}

export class HealthDataAnalysisDto {
  @ApiProperty({ description: 'Cân nặng (kg)' })
  @IsNumber()
  weight: number;

  @ApiProperty({ description: 'Chiều cao (cm)' })
  @IsNumber()
  height: number;

  @ApiProperty({ description: 'Tuổi' })
  @IsNumber()
  age: number;

  @ApiProperty({ description: 'Giới tính', enum: ['nam', 'nữ'] })
  @IsEnum(['nam', 'nữ'])
  gender: string;

  @ApiPropertyOptional({ description: 'Huyết áp tâm thu' })
  @IsOptional()
  @IsNumber()
  bloodPressureSys?: number;

  @ApiPropertyOptional({ description: 'Huyết áp tâm trương' })
  @IsOptional()
  @IsNumber()
  bloodPressureDia?: number;

  @ApiPropertyOptional({ description: 'Đường huyết' })
  @IsOptional()
  @IsNumber()
  bloodSugar?: number;

  @ApiPropertyOptional({ description: 'ID conversation để lưu lịch sử' })
  @IsOptional()
  @IsString()
  conversationId?: string;
}
