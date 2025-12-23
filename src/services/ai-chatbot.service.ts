import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthChatbotService } from './health-chatbot.service';
import { ChatbotIntentEnum } from '../dtos/chatbot.dto';
import { Mistral } from '@mistralai/mistralai';

@Injectable()
export class AIChatbotService {
  private readonly logger = new Logger(AIChatbotService.name);
  private readonly mistralClient: Mistral;
  private readonly conversationHistory = new Map<string, any[]>();

  constructor(
    private readonly healthChatbotService: HealthChatbotService,
    private readonly configService: ConfigService,
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
  ): Promise<{
    message: string;
    intent: ChatbotIntentEnum;
    data?: any;
    conversationId: string;
  }> {
    try {
      // 1. Phát hiện intent
      const intent = this.healthChatbotService.detectIntent(userMessage);
      this.logger.log(`Detected intent: ${intent}`);

      // 2. Xử lý bằng rule-based system
      const ruleBasedResult = this.healthChatbotService.processQuery(
        intent,
        healthData,
      );

      // 3. Nếu có kết quả từ rules, dùng AI để tạo câu trả lời tự nhiên
      let aiResponse = '';
      const convId = conversationId || this.generateConversationId();

      if (ruleBasedResult) {
        aiResponse = await this.generateNaturalResponse(
          userMessage,
          ruleBasedResult,
          intent,
          convId,
        );
      } else {
        // 4. Nếu không match rules, để AI trả lời trực tiếp
        aiResponse = await this.generateGeneralResponse(
          userMessage,
          intent,
          convId,
        );
      }

      return {
        message: aiResponse,
        intent,
        data: ruleBasedResult,
        conversationId: convId,
      };
    } catch (error) {
      this.logger.error('Error in chat:', error);
      return {
        message: this.getFallbackResponse(userMessage),
        intent: ChatbotIntentEnum.UNKNOWN,
        conversationId: conversationId || this.generateConversationId(),
      };
    }
  }

  //Phân tích tổng quan sức khỏe - Gọi trực tiếp không qua AI
  async analyzeHealth(healthData: any): Promise<{
    message: string;
    data: any;
    summary: string;
  }> {
    try {
      // Gọi trực tiếp hàm phân tích
      const analysisResult =
        this.healthChatbotService.analyzeOverallHealth(healthData);

      // Format message dựa trên kết quả
      let message = `📊 Phân tích sức khỏe tổng quan\n\n`;
      message += `${analysisResult.summary}\n\n`;

      if (analysisResult.details.length > 0) {
        message += `📋 Chi tiết:\n`;
        analysisResult.details.forEach((detail) => {
          const emoji = this.getHealthEmoji(detail.type);
          message += `${emoji} ${detail.category}: ${detail.type}\n`;
          message += `   ${detail.conclusion}\n\n`;
        });
      }

      if (analysisResult.recommendations.length > 0) {
        message += `💡 Khuyến cáo:\n`;
        analysisResult.recommendations.forEach((rec, index) => {
          message += `${index + 1}. ${rec}\n`;
        });
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
  ): Promise<string> {
    if (!this.mistralClient) {
      return this.formatRuleBasedResponse(ruleData, intent);
    }

    const systemPrompt = this.getSystemPrompt();
    const context = this.formatContextForAI(ruleData, intent);
    const history = this.getConversationHistory(conversationId);

    try {
      const s = await this.callMistralAPI(
        systemPrompt,
        userMessage,
        context,
        history,
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
  ): Promise<string> {
    if (!this.mistralClient) {
      return this.getDefaultResponse(intent);
    }

    const systemPrompt = this.getSystemPrompt();
    const history = this.getConversationHistory(conversationId);

    try {
      const s = await this.callMistralAPI(
        systemPrompt,
        userMessage,
        '',
        history,
      );
      return s;
    } catch (error) {
      this.logger.error('Mistral AI API error:', error);
      return this.getDefaultResponse(intent);
    }
  }

  /**
   * Gọi Mistral AI API
   */
  private async callMistralAPI(
    systemPrompt: string,
    userMessage: string,
    context: string,
    history: any[],
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

    // Gọi Mistral API
    const chatResponse = await this.mistralClient.chat.complete({
      model: 'mistral-small-latest', // Hoặc 'mistral-large-latest' tùy nhu cầu
      messages: messages,
      temperature: 0.7,
      maxTokens: 500,
    });

    // Lấy content từ response
    const content = chatResponse.choices?.[0]?.message?.content;

    if (typeof content === 'string') {
      return content;
    } else if (Array.isArray(content)) {
      // Nếu content là array, ghép các phần text lại
      return content
        .filter((item: any) => item.type === 'text')
        .map((item: any) => item.text)
        .join('');
    }

    return 'Xin lỗi, tôi không thể tạo câu trả lời lúc này.';
  }

  //System prompt cho AI
  private getSystemPrompt(): string {
    return `Bạn là trợ lý sức khỏe thông minh AI Cùng Muốn Khỏe. 
Nhiệm vụ của bạn:
- Trả lời các câu hỏi về sức khỏe một cách thân thiện, dễ hiểu
- Sử dụng dữ liệu phân tích sức khỏe được cung cấp để đưa ra câu trả lời chính xác
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

  //Quản lý lịch sử hội thoại
  private getConversationHistory(conversationId: string): any[] {
    return this.conversationHistory.get(conversationId) || [];
  }

  private addToHistory(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string,
  ) {
    const history = this.getConversationHistory(conversationId);
    history.push({ role, content });

    // Giới hạn lịch sử 10 tin nhắn cuối
    if (history.length > 10) {
      history.shift();
      history.shift();
    }

    this.conversationHistory.set(conversationId, history);
  }

  //Generate conversation ID
  private generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  //Clear conversation history
  clearHistory(conversationId: string) {
    this.conversationHistory.delete(conversationId);
  }
}
