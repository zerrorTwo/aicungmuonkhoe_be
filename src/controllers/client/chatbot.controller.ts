import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AIChatbotService } from '../../services/ai-chatbot.service';
import {
  ChatMessageDto,
  ChatResponseDto,
  HealthDataAnalysisDto,
} from '../../dtos/chatbot.dto';
import { AuthGuard } from '../../utils/auth/auth.guard';

@ApiTags('Chatbot')
@Controller('client/chatbot')
@UseGuards(AuthGuard)
export class ChatbotController {
  constructor(private readonly aiChatbotService: AIChatbotService) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Chat với AI chatbot sức khỏe',
    description:
      'Gửi tin nhắn và nhận câu trả lời từ AI chatbot. Hỗ trợ phân tích sức khỏe dựa trên dữ liệu cung cấp.',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả lời thành công',
    type: ChatResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ',
  })
  async chat(
    @Req() req,
    @Body() chatMessageDto: ChatMessageDto,
  ): Promise<ChatResponseDto> {
    const userId = req.user.user_id;

    const result = await this.aiChatbotService.chat(
      chatMessageDto.message,
      chatMessageDto.healthData,
      chatMessageDto.conversationId,
      userId,
    );

    return {
      message: result.message,
      intent: result.intent,
      data: result.data,
      conversationId: result.conversationId,
      timestamp: new Date(),
    };
  }

  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Phân tích tổng quan sức khỏe',
    description:
      'Phân tích các chỉ số sức khỏe (BMI, huyết áp, đường huyết) và đưa ra đánh giá tổng quan.',
  })
  @ApiResponse({
    status: 200,
    description: 'Phân tích thành công',
  })
  async analyzeHealth(@Req() req, @Body() healthData: HealthDataAnalysisDto) {
    const userId = req.user.user_id;

    const result = await this.aiChatbotService.analyzeHealth(
      healthData,
      healthData.conversationId,
      userId,
    );

    return {
      message: result.message,
      data: result.data,
      summary: result.summary,
      timestamp: new Date(),
    };
  }
}
