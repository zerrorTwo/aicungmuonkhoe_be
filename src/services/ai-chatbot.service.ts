import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthChatbotService } from './health-chatbot.service';
import { ChatbotIntentEnum } from '../dtos/chatbot.dto';
import { Mistral } from '@mistralai/mistralai';
import { ChatMessageRepository } from '../repositories/chat-message.repository';
import { ChatConversationRepository } from '../repositories/chat-conversation.repository';

@Injectable()
export class AIChatbotService {
  private readonly logger = new Logger(AIChatbotService.name);
  private readonly mistralClient: Mistral;

  constructor(
    private readonly healthChatbotService: HealthChatbotService,
    private readonly configService: ConfigService,
    private readonly chatMessageRepository: ChatMessageRepository,
    private readonly chatConversationRepository: ChatConversationRepository,
  ) {
    const apiKey = this.configService.get<string>('MISTRAL_API_KEY');

    if (!apiKey) {
      this.logger.warn(
        'No Mistral API key found. Please set MISTRAL_API_KEY in config YAML file',
      );
    }

    this.mistralClient = new Mistral({ apiKey: apiKey || '' });

    this.logger.log('AI Chatbot initialized with Mistral AI');
  }

  //Xử lý tin nhắn từ user
  async chat(
    userMessage: string,
    healthData?: any,
    conversationId?: string,
    userId?: number,
  ): Promise<{
    message: string;
    intent: ChatbotIntentEnum;
    data?: any;
    conversationId: string;
  }> {
    try {
      if (!conversationId) {
        throw new Error('Conversation ID is required');
      }

      // Verify conversation exists and belongs to user
      const conversation =
        await this.chatConversationRepository.findByConversationId(
          conversationId,
        );
      if (!conversation) {
        throw new Error('Invalid conversation ID');
      }

      // Validate user ownership if userId provided
      if (userId && conversation.USER_ID !== userId) {
        throw new Error(
          'Unauthorized: Conversation does not belong to this user',
        );
      }

      // Save user message
      await this.chatMessageRepository.create({
        conversationId,
        role: 'user',
        content: userMessage,
        mode: 'qna',
      });

      // 1. Phát hiện intent
      const intent = this.healthChatbotService.detectIntent(userMessage);
      this.logger.log(`Detected intent: ${intent}`);

      // 2. Xử lý bằng rule-based system
      const ruleBasedResult = this.healthChatbotService.processQuery(
        intent,
        healthData,
      );

      // 3. Get conversation history from DB
      const history =
        await this.chatMessageRepository.getHistory(conversationId);

      // 4. Generate response
      let aiResponse = '';
      let actionData: any = null;

      if (ruleBasedResult) {
        aiResponse = await this.generateNaturalResponse(
          userMessage,
          ruleBasedResult,
          intent,
          conversationId,
          history,
          healthData,
        );

        // Check if response contains dish recommendation action
        if (
          intent === ChatbotIntentEnum.DISH_RECOMMENDATION ||
          aiResponse.includes('Phù hợp với bạn')
        ) {
          actionData = {
            action: 'navigate_to_recommended_dishes',
            hasHealthData: !!(healthData?.weight && healthData?.height),
          };
        }
      } else {
        aiResponse = await this.generateGeneralResponse(
          userMessage,
          intent,
          conversationId,
          history,
          healthData,
        );

        // Check if AI triggered function calling for dish recommendation
        if (
          aiResponse.includes('Phù hợp với bạn') ||
          aiResponse.includes('Thực đơn cá nhân')
        ) {
          actionData = {
            action: 'navigate_to_recommended_dishes',
            hasHealthData: !!(healthData?.weight && healthData?.height),
          };
        }
      }

      // Save assistant message
      await this.chatMessageRepository.create({
        conversationId,
        role: 'assistant',
        content: aiResponse,
        intent,
        mode: 'qna',
      });

      return {
        message: aiResponse,
        intent,
        data: actionData || ruleBasedResult,
        conversationId,
      };
    } catch (error) {
      this.logger.error('Error in chat:', error);
      return {
        message: this.getFallbackResponse(userMessage),
        intent: ChatbotIntentEnum.UNKNOWN,
        conversationId: conversationId || '',
      };
    }
  }

  //Phân tích tổng quan sức khỏe
  async analyzeHealth(
    healthData: any,
    conversationId?: string,
    userId?: number,
  ): Promise<{
    message: string;
    data: any;
    summary: string;
  }> {
    try {
      if (conversationId) {
        // Verify conversation exists and belongs to user
        const conversation =
          await this.chatConversationRepository.findByConversationId(
            conversationId,
          );
        if (conversation) {
          // Validate user ownership if userId provided
          if (userId && conversation.USER_ID !== userId) {
            throw new Error(
              'Unauthorized: Conversation does not belong to this user',
            );
          }

          // Save system message about analysis
          await this.chatMessageRepository.create({
            conversationId,
            role: 'system',
            content: 'User requested health analysis',
            mode: 'analyze',
          });
        }
      }

      // Gọi trực tiếp hàm phân tích
      const analysisResult =
        this.healthChatbotService.analyzeOverallHealth(healthData);

      // Format message với các chỉ số cụ thể
      let message = `📊 **Phân tích sức khỏe của bạn**\n\n`;

      // Hiển thị các chỉ số đầu vào
      message += `📌 **Thông tin cơ bản:**\n`;
      if (healthData.weight && healthData.height) {
        message += `• Cân nặng: ${healthData.weight} kg\n`;
        message += `• Chiều cao: ${healthData.height} cm\n`;
      }
      if (healthData.age) {
        message += `• Tuổi: ${healthData.age}\n`;
      }
      if (healthData.bloodPressureSys && healthData.bloodPressureDia) {
        message += `• Huyết áp: ${healthData.bloodPressureSys}/${healthData.bloodPressureDia} mmHg\n`;
      }
      if (healthData.bloodSugar) {
        message += `• Đường huyết: ${healthData.bloodSugar} mg/dL\n`;
      }
      message += `\n`;

      // Kết luận tổng quan
      message += `📝 **Đánh giá tổng quan:**\n${analysisResult.summary}\n\n`;

      if (analysisResult.details.length > 0) {
        message += `📋 **Chi tiết phân tích:**\n`;
        analysisResult.details.forEach((detail) => {
          const emoji = this.getHealthEmoji(detail.type);
          message += `\n${emoji} **${detail.category}**\n`;

          // Hiển thị giá trị cụ thể
          if (detail.category === 'BMI' && detail.bmi) {
            message += `   Chỉ số BMI: ${detail.bmi}\n`;
          } else if (
            detail.category === 'Huyết áp' &&
            detail.systolic &&
            detail.diastolic
          ) {
            message += `   Huyết áp: ${detail.systolic}/${detail.diastolic} mmHg\n`;
          } else if (detail.category === 'Đường huyết' && detail.bloodSugar) {
            message += `   Đường huyết: ${detail.bloodSugar} mg/dL\n`;
          }

          message += `   ➜ Phân loại: ${detail.type}\n`;
          message += `   ➜ ${detail.conclusion}\n`;
        });
        message += `\n`;
      }

      if (analysisResult.recommendations.length > 0) {
        message += `💡 **Khuyến cáo:**\n`;
        analysisResult.recommendations.forEach((rec, index) => {
          message += `${index + 1}. ${rec}\n`;
        });
      }

      // Save assistant message if conversationId provided
      if (conversationId) {
        const conversation =
          await this.chatConversationRepository.findByConversationId(
            conversationId,
          );
        if (conversation) {
          await this.chatMessageRepository.create({
            conversationId,
            role: 'assistant',
            content: message,
            mode: 'analyze',
          });
        }
      }

      return {
        message,
        data: analysisResult,
        summary: analysisResult.summary,
      };
    } catch (error) {
      this.logger.error('Error in analyzeHealth:', error);
      return {
        message:
          'Xin lỗi, không thể phân tích sức khỏe. Vui lòng kiểm tra lại dữ liệu đầu vào.',
        data: null,
        summary: 'Phân tích thất bại',
      };
    }
  }

  //Get emoji cho health status
  private getHealthEmoji(type: string): string {
    if (type.includes('Bình thường')) return '✅';
    if (type.includes('Béo phì') || type.includes('Tiểu đường')) return '🔴';
    if (type.includes('Thừa cân') || type.includes('Tiền')) return '🟡';
    if (type.includes('Thiếu cân') || type.includes('thấp')) return '🟠';
    if (type.includes('cao huyết áp')) return '🔴';
    return '⚪';
  }

  //Tạo câu trả lời tự nhiên từ dữ liệu rule-based
  private async generateNaturalResponse(
    userMessage: string,
    ruleData: any,
    intent: ChatbotIntentEnum,
    conversationId: string,
    history: any[],
    healthData?: any,
  ): Promise<string> {
    if (!this.mistralClient) {
      return this.formatRuleBasedResponse(ruleData, intent);
    }

    const systemPrompt = this.getSystemPrompt();
    const context = this.formatContextForAI(ruleData, intent);

    try {
      const s = await this.callMistralAPI(
        systemPrompt,
        userMessage,
        context,
        history,
        healthData,
      );
      return s;
    } catch (error) {
      this.logger.error('Mistral AI API error:', error);
      return this.formatRuleBasedResponse(ruleData, intent);
    }
  }

  /**
   * Tạo câu trả lời chung khi không match rules
   */
  private async generateGeneralResponse(
    userMessage: string,
    intent: ChatbotIntentEnum,
    conversationId: string,
    history: any[],
    healthData?: any,
  ): Promise<string> {
    if (!this.mistralClient) {
      return this.getDefaultResponse(intent);
    }

    const systemPrompt = this.getSystemPrompt();

    try {
      const s = await this.callMistralAPI(
        systemPrompt,
        userMessage,
        '',
        history,
        healthData,
      );
      return s;
    } catch (error) {
      this.logger.error('Mistral AI API error:', error);
      return this.getDefaultResponse(intent);
    }
  }

  /**
   * Gọi Mistral AI API với function calling
   */
  private async callMistralAPI(
    systemPrompt: string,
    userMessage: string,
    context: string,
    history: any[],
    healthData?: any,
  ): Promise<string> {
    // Build messages array theo format của Mistral
    const messages: any[] = [{ role: 'system', content: systemPrompt }];

    // Thêm lịch sử hội thoại
    if (history && history.length > 0) {
      messages.push(...history);
    }

    // Tạo user message với context
    let userContent = userMessage;
    if (context) {
      userContent = `Dữ liệu phân tích sức khỏe:\n${context}\n\nCâu hỏi: ${userMessage}`;
    }
    messages.push({ role: 'user', content: userContent });

    // Định nghĩa function/tool cho dish recommendation
    const tools: any[] = [
      {
        type: 'function',
        function: {
          name: 'recommend_dishes_by_health',
          description:
            'Gợi ý món ăn phù hợp dựa trên tình trạng sức khỏe của người dùng. Sử dụng khi người dùng hỏi về món ăn, thực đơn, nên ăn gì.',
          parameters: {
            type: 'object',
            properties: {
              reason: {
                type: 'string',
                description: 'Lý do gợi ý món ăn dựa trên tình trạng sức khỏe',
              },
            },
            required: ['reason'],
          },
        },
      },
    ];

    try {
      // Gọi Mistral API với tools
      const chatResponse = await this.mistralClient.chat.complete({
        model: 'mistral-small-latest',
        messages: messages,
        tools: tools,
        toolChoice: 'auto', // AI tự quyết định khi nào gọi function
        temperature: 0.7,
        maxTokens: 500,
      });

      const message = chatResponse.choices?.[0]?.message;

      // Kiểm tra xem AI có gọi tool không
      if (message?.toolCalls && message.toolCalls.length > 0) {
        const toolCall = message.toolCalls[0];

        if (toolCall.function.name === 'recommend_dishes_by_health') {
          // AI muốn gọi function recommend dishes
          this.logger.log('AI triggered function: recommend_dishes_by_health');

          // Kiểm tra healthData
          if (!healthData || !healthData.weight || !healthData.height) {
            return 'Để tôi có thể gợi ý món ăn phù hợp, bạn cần cập nhật thông tin sức khỏe (cân nặng, chiều cao, BMI, đường huyết, cholesterol) trong hồ sơ của bạn. Sau đó hãy quay lại trang Tư vấn sức khỏe → Thực đơn cá nhân → tab "Phù hợp với bạn" để xem gợi ý.';
          }

          // Parse function arguments
          const args =
            typeof toolCall.function.arguments === 'string'
              ? JSON.parse(toolCall.function.arguments)
              : toolCall.function.arguments;

          // Tạo response với hướng dẫn navigate
          const response = `Dựa trên tình trạng sức khỏe của bạn, tôi có một số gợi ý món ăn phù hợp! 

${args.reason || 'Các món ăn được lựa chọn dựa trên chỉ số sức khỏe của bạn.'}

Để xem danh sách món ăn được đề xuất chi tiết, hãy:
1. Vào trang **Tư vấn sức khỏe**
2. Chọn **Thực đơn cá nhân**
3. Chuyển sang tab **"Phù hợp với bạn"**

Tôi sẽ tự động chuyển bạn đến đó ngay bây giờ! 🍽️`;

          return response;
        }
      }

      // Không có tool call, trả response bình thường
      const content = message?.content;

      if (typeof content === 'string') {
        return content;
      } else if (Array.isArray(content)) {
        return content
          .filter((item: any) => item.type === 'text')
          .map((item: any) => item.text)
          .join('');
      }

      return 'Xin lỗi, tôi không thể tạo câu trả lời lúc này.';
    } catch (error) {
      this.logger.error('Mistral API error:', error);
      throw error;
    }
  }

  //System prompt cho AI
  private getSystemPrompt(): string {
    return `Bạn là trợ lý sức khỏe thông minh AI Cùng Muốn Khỏe. 
Nhiệm vụ của bạn:
- Trả lời các câu hỏi về sức khỏe một cách thân thiện, dễ hiểu
- Sử dụng dữ liệu phân tích sức khỏe được cung cấp để đưa ra câu trả lời chính xác
- Khi người dùng hỏi về món ăn, thực đơn, nên ăn gì - hãy sử dụng function recommend_dishes_by_health để gợi ý món ăn phù hợp với tình trạng sức khỏe
- Luôn khuyến khích người dùng đi khám bác sĩ khi cần thiết
- Không đưa ra chẩn đoán y tế, chỉ cung cấp thông tin tham khảo
- Trả lời bằng tiếng Việt, giọng điệu thân thiện và chuyên nghiệp
- Câu trả lời ngắn gọn, súc tích (dưới 200 từ)`;
  }

  //Format context cho AI
  private formatContextForAI(ruleData: any, intent: ChatbotIntentEnum): string {
    let context = '';

    if (intent === ChatbotIntentEnum.BMI_INQUIRY) {
      context = `Chỉ số BMI: ${ruleData.bmi}
Phân loại: ${ruleData.type}
Kết luận: ${ruleData.conclusion}
Khuyến cáo: ${ruleData.recommend}`;
    } else if (intent === ChatbotIntentEnum.BLOOD_PRESSURE_INQUIRY) {
      context = `Huyết áp: ${ruleData.systolic}/${ruleData.diastolic} mmHg
Phân loại: ${ruleData.type}
Kết luận: ${ruleData.conclusion}
Khuyến cáo: ${ruleData.recommend}`;
    } else if (intent === ChatbotIntentEnum.BLOOD_SUGAR_INQUIRY) {
      context = `Đường huyết: ${ruleData.bloodSugar} mg/dL (${ruleData.testType === 'fasting' ? 'lúc đói' : 'sau ăn'})
Phân loại: ${ruleData.type}
Kết luận: ${ruleData.conclusion}
Khuyến cáo: ${ruleData.recommend}`;
    } else if (intent === ChatbotIntentEnum.GENERAL_HEALTH_INQUIRY) {
      context = `Tổng quan sức khỏe:
${ruleData.summary}

Chi tiết:
${ruleData.details.map((d) => `- ${d.category}: ${d.type} (${d.conclusion})`).join('\n')}

Khuyến cáo:
${ruleData.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}`;
    }

    return context;
  }

  //Format rule-based response (khi không có AI)
  private formatRuleBasedResponse(
    ruleData: any,
    intent: ChatbotIntentEnum,
  ): string {
    if (intent === ChatbotIntentEnum.BMI_INQUIRY) {
      return `Chỉ số BMI của bạn là ${ruleData.bmi}, thuộc nhóm "${ruleData.type}".

${ruleData.conclusion}

Khuyến cáo: ${ruleData.recommend}`;
    } else if (intent === ChatbotIntentEnum.BLOOD_PRESSURE_INQUIRY) {
      return `Huyết áp của bạn là ${ruleData.systolic}/${ruleData.diastolic} mmHg, thuộc nhóm "${ruleData.type}".

${ruleData.conclusion}

Khuyến cáo: ${ruleData.recommend}`;
    } else if (intent === ChatbotIntentEnum.BLOOD_SUGAR_INQUIRY) {
      return `Đường huyết của bạn là ${ruleData.bloodSugar} mg/dL (${ruleData.testType === 'fasting' ? 'lúc đói' : 'sau ăn'}), thuộc nhóm "${ruleData.type}".

${ruleData.conclusion}

Khuyến cáo: ${ruleData.recommend}`;
    } else if (intent === ChatbotIntentEnum.GENERAL_HEALTH_INQUIRY) {
      let response = `${ruleData.summary}\n\n`;
      response += 'Chi tiết:\n';
      ruleData.details.forEach((d) => {
        response += `• ${d.category}: ${d.type} - ${d.conclusion}\n`;
      });
      response += '\nKhuyến cáo:\n';
      ruleData.recommendations.forEach((r, i) => {
        response += `${i + 1}. ${r}\n`;
      });
      return response;
    }

    return 'Xin lỗi, tôi không thể xử lý câu hỏi này.';
  }

  //Get default response khi không có data
  private getDefaultResponse(intent: ChatbotIntentEnum): string {
    switch (intent) {
      case ChatbotIntentEnum.BMI_INQUIRY:
        return 'Để tính chỉ số BMI, tôi cần biết cân nặng (kg), chiều cao (cm), tuổi và giới tính của bạn. Bạn có thể cung cấp thông tin này không?';
      case ChatbotIntentEnum.BLOOD_PRESSURE_INQUIRY:
        return 'Để đánh giá huyết áp, tôi cần biết chỉ số huyết áp tâm thu và tâm trương của bạn. Bạn có thể cho tôi biết không?';
      case ChatbotIntentEnum.BLOOD_SUGAR_INQUIRY:
        return 'Để đánh giá đường huyết, tôi cần biết chỉ số đường huyết của bạn (mg/dL). Bạn có thể cung cấp thông tin này không?';
      case ChatbotIntentEnum.HEALTH_ADVICE:
        return 'Tôi có thể tư vấn về sức khỏe dựa trên các chỉ số như BMI, huyết áp, đường huyết. Bạn muốn tôi phân tích chỉ số nào?';
      default:
        return 'Xin chào! Tôi là trợ lý sức khỏe AI. Tôi có thể giúp bạn phân tích BMI, huyết áp, đường huyết và đưa ra lời khuyên sức khỏe. Bạn cần tư vấn về vấn đề gì?';
    }
  }

  //Fallback response khi có lỗi
  private getFallbackResponse(userMessage: string): string {
    return 'Xin lỗi, tôi đang gặp một chút sự cố. Bạn có thể thử lại sau hoặc liên hệ với bộ phận hỗ trợ không?';
  }
}
