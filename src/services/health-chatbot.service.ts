import { Injectable } from '@nestjs/common';
import { Conclusion } from '../utils/conclusion';
import { AGE_TYPE, ACTIVE_TAB, HEALTH_MODEL } from '../utils/constants';
import { ChatbotIntentEnum } from '../dtos/chatbot.dto';

/**
 * Health Chatbot Service - Rule-based system
 * Xử lý các câu hỏi sức khỏe dựa trên rules và logic có sẵn
 */
@Injectable()
export class HealthChatbotService {
  /**
   * Phát hiện intent từ tin nhắn người dùng
   */
  detectIntent(message: string): ChatbotIntentEnum {
    const lowerMessage = message.toLowerCase();

    // BMI Intent
    if (
      lowerMessage.includes('bmi') ||
      lowerMessage.includes('cân nặng') ||
      lowerMessage.includes('chiều cao') ||
      lowerMessage.includes('chỉ số khối') ||
      lowerMessage.includes('béo') ||
      lowerMessage.includes('gầy')
    ) {
      return ChatbotIntentEnum.BMI_INQUIRY;
    }

    // Blood Pressure Intent
    if (
      lowerMessage.includes('huyết áp') ||
      lowerMessage.includes('huyết ap') ||
      lowerMessage.includes('huyệt áp') ||
      lowerMessage.includes('cao huyết áp') ||
      lowerMessage.includes('tâm thu') ||
      lowerMessage.includes('tâm trương')
    ) {
      return ChatbotIntentEnum.BLOOD_PRESSURE_INQUIRY;
    }

    // Blood Sugar Intent
    if (
      lowerMessage.includes('đường huyết') ||
      lowerMessage.includes('duong huyet') ||
      lowerMessage.includes('tiểu đường') ||
      lowerMessage.includes('tieu duong') ||
      lowerMessage.includes('glucose') ||
      lowerMessage.includes('hba1c')
    ) {
      return ChatbotIntentEnum.BLOOD_SUGAR_INQUIRY;
    }

    // Health Advice Intent
    if (
      lowerMessage.includes('lời khuyên') ||
      lowerMessage.includes('khuyến cáo') ||
      lowerMessage.includes('nên') ||
      lowerMessage.includes('làm gì') ||
      lowerMessage.includes('cải thiện') ||
      lowerMessage.includes('giúp tôi')
    ) {
      return ChatbotIntentEnum.HEALTH_ADVICE;
    }

    // General Health Intent
    if (
      lowerMessage.includes('sức khỏe') ||
      lowerMessage.includes('suc khoe') ||
      lowerMessage.includes('tình trạng') ||
      lowerMessage.includes('tinh trang')
    ) {
      return ChatbotIntentEnum.GENERAL_HEALTH_INQUIRY;
    }

    return ChatbotIntentEnum.UNKNOWN;
  }

  /**
   * Tính toán BMI và đưa ra kết luận
   */
  calculateBMI(weight: number, height: number, age: number, gender: string) {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    // Xác định loại tuổi - sử dụng WEIGHT_HEIGHT vì BMI tính theo cả cân nặng và chiều cao
    const ageType = Conclusion.getTypeAge(age, ACTIVE_TAB.WEIGHT_HEIGHT);

    let conclusion = '';
    let recommend = '';
    let type = '';
    let color = '';

    // Logic phân loại BMI dựa trên tuổi
    if (age < 5) {
      // Trẻ em 0-5 tuổi - cần dùng biểu đồ tăng trưởng WHO
      type = 'Cần đánh giá chuyên sâu';
      conclusion =
        'Trẻ em dưới 5 tuổi cần được đánh giá bằng biểu đồ tăng trưởng chuẩn WHO theo tháng tuổi';
      recommend =
        'Nên đưa trẻ đi khám để bác sĩ đánh giá tình trạng phát triển theo biểu đồ tăng trưởng. Chatbot không thể đánh giá chính xác cho độ tuổi này.';
      color = '#FFA500';
    } else if (age >= 5 && age < 20) {
      // Trẻ em và thanh thiếu niên 5-19 tuổi
      // Sử dụng bảng chuẩn WHO theo tuổi - Đơn giản hóa
      if (bmi < 14) {
        type = 'Suy dinh dưỡng';
        conclusion = 'Cân nặng thấp so với chuẩn độ tuổi';
        recommend =
          'Cần tăng cường dinh dưỡng và đi khám để được tư vấn cụ thể theo độ tuổi';
        color = '#FF0000';
      } else if (bmi >= 14 && bmi < 17) {
        type = 'Thiếu cân';
        conclusion = 'Cân nặng hơi thấp so với độ tuổi';
        recommend =
          'Nên bổ sung dinh dưỡng đầy đủ và theo dõi tăng trưởng đều đặn';
        color = '#FFA500';
      } else if (bmi >= 17 && bmi < 23) {
        type = 'Bình thường';
        conclusion = 'Cân nặng phù hợp với độ tuổi';
        recommend =
          'Duy trì chế độ ăn lành mạnh và vận động thể thao phù hợp lứa tuổi';
        color = '#00FF00';
      } else if (bmi >= 23 && bmi < 27) {
        type = 'Thừa cân';
        conclusion = 'Cân nặng hơi cao so với độ tuổi';
        recommend =
          'Nên điều chỉnh chế độ ăn, giảm đồ ăn vặt và tăng hoạt động thể chất';
        color = '#FFFF00';
      } else {
        type = 'Béo phì';
        conclusion = 'Cân nặng cao so với độ tuổi';
        recommend =
          'Cần tham khảo bác sĩ dinh dưỡng để có chương trình giảm cân phù hợp với lứa tuổi';
        color = '#FF9900';
      }
    } else if (age >= 20 && age < 70) {
      // Người lớn 20-70 tuổi
      if (bmi < 18.5) {
        type = 'Thiếu cân';
        conclusion = 'Cân nặng của bạn thấp hơn mức bình thường';
        recommend =
          'Nên tăng cường dinh dưỡng, ăn đủ bữa và bổ sung thêm protein, chất béo lành mạnh';
        color = '#FFA500';
      } else if (bmi >= 18.5 && bmi < 23) {
        type = 'Bình thường';
        conclusion = 'Cân nặng của bạn ở mức lý tưởng';
        recommend =
          'Duy trì chế độ ăn uống cân bằng và tập thể dục thường xuyên';
        color = '#00FF00';
      } else if (bmi >= 23 && bmi < 25) {
        type = 'Thừa cân';
        conclusion = 'Cân nặng của bạn hơi cao so với chiều cao';
        recommend =
          'Nên giảm nhẹ cân bằng cách ăn ít tinh bột, đường và tăng vận động';
        color = '#FFFF00';
      } else if (bmi >= 25 && bmi < 30) {
        type = 'Béo phì độ I';
        conclusion = 'Bạn đang thừa cân ở mức độ nhẹ';
        recommend =
          'Cần giảm cân bằng chế độ ăn kiêng và tập thể dục đều đặn. Nên tham khảo ý kiến bác sĩ';
        color = '#FF9900';
      } else {
        type = 'Béo phì độ II';
        conclusion = 'Bạn đang béo phì ở mức độ nghiêm trọng';
        recommend =
          'Cần giảm cân gấp với sự hỗ trợ của bác sĩ và chuyên gia dinh dưỡng';
        color = '#FF0000';
      }
    } else if (age >= 70) {
      // Người cao tuổi >= 70
      if (bmi < 23) {
        type = 'Thiếu cân';
        conclusion = 'Cân nặng thấp so với mức khuyến cáo cho người cao tuổi';
        recommend =
          'Cần bổ sung dinh dưỡng đầy đủ, ăn nhiều bữa nhỏ trong ngày';
        color = '#FFA500';
      } else if (bmi >= 23 && bmi < 28) {
        type = 'Bình thường';
        conclusion = 'Cân nặng phù hợp cho người cao tuổi';
        recommend = 'Duy trì chế độ ăn uống lành mạnh và vận động nhẹ nhàng';
        color = '#00FF00';
      } else {
        type = 'Thừa cân';
        conclusion = 'Cân nặng cao hơn mức khuyến cáo';
        recommend =
          'Nên điều chỉnh chế độ ăn giảm chất béo và đường, tham khảo bác sĩ';
        color = '#FF9900';
      }
    }

    return {
      bmi: parseFloat(bmi.toFixed(2)),
      type,
      conclusion,
      recommend,
      color,
      ageType,
    };
  }

  /**
   * Đánh giá huyết áp
   */
  evaluateBloodPressure(systolic: number, diastolic: number) {
    let type = '';
    let conclusion = '';
    let recommend = '';
    let color = '';

    if (systolic < 90 || diastolic < 60) {
      type = 'Huyết áp thấp';
      conclusion = 'Huyết áp của bạn thấp hơn mức bình thường';
      recommend =
        'Nên uống nhiều nước, ăn đủ muối và tham khảo ý kiến bác sĩ nếu có triệu chứng chóng mặt';
      color = '#0000FF';
    } else if (systolic < 120 && diastolic < 80) {
      type = 'Bình thường';
      conclusion = 'Huyết áp của bạn ở mức lý tưởng';
      recommend = 'Duy trì lối sống lành mạnh và kiểm tra định kỳ';
      color = '#00FF00';
    } else if (systolic < 130 && diastolic < 85) {
      type = 'Tiền cao huyết áp';
      conclusion = 'Huyết áp của bạn hơi cao';
      recommend =
        'Nên giảm muối trong ăn uống, tăng vận động và theo dõi thường xuyên';
      color = '#FFFF00';
    } else if (systolic < 140 && diastolic < 90) {
      type = 'Cao huyết áp độ 1';
      conclusion = 'Bạn có dấu hiệu cao huyết áp';
      recommend =
        'Cần thay đổi lối sống và có thể cần dùng thuốc. Hãy tham khảo bác sĩ';
      color = '#FF9900';
    } else if (systolic < 160 && diastolic < 100) {
      type = 'Cao huyết áp độ 2';
      conclusion = 'Bạn bị cao huyết áp ở mức độ trung bình';
      recommend = 'Cần điều trị bằng thuốc và thay đổi lối sống ngay lập tức';
      color = '#FF6600';
    } else {
      type = 'Cao huyết áp độ 3';
      conclusion = 'Bạn bị cao huyết áp nghiêm trọng';
      recommend = 'Cần đi khám bác sĩ ngay và điều trị tích cực';
      color = '#FF0000';
    }

    return {
      systolic,
      diastolic,
      type,
      conclusion,
      recommend,
      color,
    };
  }

  /**
   * Đánh giá đường huyết
   */
  evaluateBloodSugar(
    bloodSugar: number,
    testType: 'fasting' | 'postprandial' = 'fasting',
  ) {
    let type = '';
    let conclusion = '';
    let recommend = '';
    let color = '';

    if (testType === 'fasting') {
      // Đường huyết lúc đói
      if (bloodSugar < 70) {
        type = 'Hạ đường huyết';
        conclusion = 'Đường huyết của bạn thấp hơn bình thường';
        recommend =
          'Nên ăn ngay thực phẩm có đường hoặc uống nước ngọt. Nếu triệu chứng nặng, đi bệnh viện ngay';
        color = '#0000FF';
      } else if (bloodSugar >= 70 && bloodSugar < 100) {
        type = 'Bình thường';
        conclusion = 'Đường huyết của bạn ở mức lý tưởng';
        recommend = 'Duy trì chế độ ăn cân bằng và tập thể dục thường xuyên';
        color = '#00FF00';
      } else if (bloodSugar >= 100 && bloodSugar < 126) {
        type = 'Tiền tiểu đường';
        conclusion = 'Đường huyết của bạn hơi cao';
        recommend =
          'Nên giảm ăn đồ ngọt, tinh bột tinh chế và tăng vận động. Khám sức khỏe định kỳ';
        color = '#FFFF00';
      } else {
        type = 'Tiểu đường';
        conclusion = 'Đường huyết của bạn cao, có dấu hiệu tiểu đường';
        recommend =
          'Cần đi khám bác sĩ ngay để được chẩn đoán và điều trị kịp thời';
        color = '#FF0000';
      }
    } else {
      // Đường huyết sau ăn 2 tiếng
      if (bloodSugar < 140) {
        type = 'Bình thường';
        conclusion = 'Đường huyết sau ăn của bạn ở mức bình thường';
        recommend = 'Tiếp tục duy trì chế độ ăn uống lành mạnh';
        color = '#00FF00';
      } else if (bloodSugar >= 140 && bloodSugar < 200) {
        type = 'Tiền tiểu đường';
        conclusion = 'Đường huyết sau ăn của bạn hơi cao';
        recommend =
          'Nên kiểm soát lượng carbohydrate trong bữa ăn và tăng vận động';
        color = '#FFFF00';
      } else {
        type = 'Tiểu đường';
        conclusion = 'Đường huyết sau ăn cao, nguy cơ tiểu đường';
        recommend = 'Cần đi khám và xét nghiệm tiểu đường ngay';
        color = '#FF0000';
      }
    }

    return {
      bloodSugar,
      testType,
      type,
      conclusion,
      recommend,
      color,
    };
  }

  /**
   * Phân tích tổng quan sức khỏe
   */
  analyzeOverallHealth(healthData: {
    weight?: number;
    height?: number;
    age?: number;
    gender?: string;
    bloodPressureSys?: number;
    bloodPressureDia?: number;
    bloodSugar?: number;
  }) {
    const results: any = {
      summary: '',
      details: [],
      overallRisk: 'low', // low, medium, high
      recommendations: [],
    };

    let riskScore = 0;

    // Đánh giá BMI
    if (
      healthData.weight &&
      healthData.height &&
      healthData.age &&
      healthData.gender
    ) {
      const bmiResult = this.calculateBMI(
        healthData.weight,
        healthData.height,
        healthData.age,
        healthData.gender,
      );
      results.details.push({
        category: 'BMI',
        ...bmiResult,
      });

      if (bmiResult.type.includes('Béo phì')) riskScore += 2;
      else if (bmiResult.type.includes('Thừa cân')) riskScore += 1;
      else if (bmiResult.type.includes('Thiếu cân')) riskScore += 1;
    }

    // Đánh giá huyết áp
    if (healthData.bloodPressureSys && healthData.bloodPressureDia) {
      const bpResult = this.evaluateBloodPressure(
        healthData.bloodPressureSys,
        healthData.bloodPressureDia,
      );
      results.details.push({
        category: 'Huyết áp',
        ...bpResult,
      });

      if (bpResult.type.includes('độ 3')) riskScore += 3;
      else if (bpResult.type.includes('độ 2')) riskScore += 2;
      else if (bpResult.type.includes('độ 1')) riskScore += 1;
    }

    // Đánh giá đường huyết
    if (healthData.bloodSugar) {
      const bsResult = this.evaluateBloodSugar(healthData.bloodSugar);
      results.details.push({
        category: 'Đường huyết',
        ...bsResult,
      });

      if (bsResult.type.includes('Tiểu đường')) riskScore += 2;
      else if (bsResult.type.includes('Tiền tiểu đường')) riskScore += 1;
    }

    // Tổng hợp đánh giá
    if (riskScore === 0) {
      results.overallRisk = 'low';
      results.summary =
        'Tình trạng sức khỏe của bạn tốt. Hãy tiếp tục duy trì lối sống lành mạnh!';
    } else if (riskScore <= 2) {
      results.overallRisk = 'medium';
      results.summary =
        'Có một số chỉ số sức khỏe cần chú ý. Nên thay đổi lối sống và theo dõi thường xuyên.';
    } else {
      results.overallRisk = 'high';
      results.summary =
        'Tình trạng sức khỏe của bạn cần được chú ý nghiêm túc. Nên đi khám bác sĩ để được tư vấn và điều trị.';
    }

    // Tổng hợp khuyến cáo
    results.details.forEach((detail) => {
      if (detail.recommend) {
        results.recommendations.push(detail.recommend);
      }
    });

    return results;
  }

  /**
   * Xử lý câu hỏi theo intent
   */
  processQuery(intent: ChatbotIntentEnum, healthData?: any) {
    switch (intent) {
      case ChatbotIntentEnum.BMI_INQUIRY:
        if (
          healthData?.weight &&
          healthData?.height &&
          healthData?.age &&
          healthData?.gender
        ) {
          return this.calculateBMI(
            healthData.weight,
            healthData.height,
            healthData.age,
            healthData.gender,
          );
        }
        return null;

      case ChatbotIntentEnum.BLOOD_PRESSURE_INQUIRY:
        if (healthData?.bloodPressureSys && healthData?.bloodPressureDia) {
          return this.evaluateBloodPressure(
            healthData.bloodPressureSys,
            healthData.bloodPressureDia,
          );
        }
        return null;

      case ChatbotIntentEnum.BLOOD_SUGAR_INQUIRY:
        if (healthData?.bloodSugar) {
          return this.evaluateBloodSugar(healthData.bloodSugar);
        }
        return null;

      case ChatbotIntentEnum.GENERAL_HEALTH_INQUIRY:
        if (healthData) {
          return this.analyzeOverallHealth(healthData);
        }
        return null;

      default:
        return null;
    }
  }
}
