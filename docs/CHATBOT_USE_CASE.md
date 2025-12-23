# [UC-17] Chatbot Trợ Lý Sức Khỏe Hỗ Trợ Người Dùng

## Actor

Người dùng (đã đăng nhập hoặc khách) muốn tra cứu, tư vấn và phân tích các chỉ số sức khỏe thông qua hội thoại tự nhiên với trợ lý AI.

## Trigger

- Actor nhấn vào biểu tượng Chatbot (floating widget) trên giao diện bất kỳ.
- Actor nhập câu hỏi hoặc thông tin sức khỏe vào ô chat.
- Actor chọn "Phân tích sức khỏe" để nhận đánh giá tổng quan từ các chỉ số đã lưu.

## Description

Use case này cho phép actor:

- **Hỏi đáp tự nhiên**: Đặt câu hỏi về BMI, huyết áp, đường huyết, sức khỏe tổng quát bằng ngôn ngữ tự nhiên (tiếng Việt).
- **Phân tích chỉ số sức khỏe**: Cung cấp cân nặng, chiều cao, tuổi, giới tính, huyết áp, đường huyết để nhận phân tích và khuyến cáo.
- **Nhận kết luận tức thì**: Hệ thống áp dụng các quy tắc y tế (WHO, chuẩn châu Á) và AI để đưa ra kết luận chính xác, dễ hiểu.
- **Theo dõi hội thoại liên tục**: Chatbot ghi nhớ ngữ cảnh trong một phiên trò chuyện để trả lời các câu hỏi follow-up.
- **Hỗ trợ đa độ tuổi**: Phân tích riêng biệt cho trẻ em (0-19 tuổi), người trưởng thành (20-70 tuổi), người cao tuổi (>70 tuổi).

## Pre-Conditions

- Hệ thống đã tích hợp AI Provider (Google Gemini hoặc OpenAI GPT).
- API Key đã được cấu hình trong file `local.yaml` hoặc `production.yaml`.
- Các chuẩn đánh giá sức khỏe (BMI theo WHO Asia-Pacific, huyết áp AHA/ESC, đường huyết ADA) đã được định nghĩa trong backend.
- (Tùy chọn) Actor đã đăng nhập để lưu lịch sử hội thoại.

## Post-Conditions

- **Sau khi hỏi đáp thành công**:
  - Hệ thống lưu lại lịch sử hội thoại (nếu có `conversationId`).
  - Actor nhận được câu trả lời tự nhiên, thân thiện với:
    - Kết luận về chỉ số sức khỏe (nếu có dữ liệu).
    - Khuyến cáo cụ thể (chế độ ăn, tập luyện, khám bác sĩ).
    - Intent của câu hỏi (BMI_INQUIRY, BLOOD_PRESSURE_INQUIRY, BLOOD_SUGAR_INQUIRY, GENERAL_HEALTH_INQUIRY, HEALTH_ADVICE, UNKNOWN).
- **Sau khi phân tích sức khỏe tổng quan**:
  - Hệ thống trả về:
    - Tóm tắt tình trạng sức khỏe (Excellent, Good, Fair, At Risk).
    - Chi tiết từng chỉ số (BMI, huyết áp, đường huyết) với phân loại và kết luận.
    - Mức độ rủi ro tổng thể (low, medium, high).
    - Danh sách khuyến nghị ưu tiên.
- **Lưu trữ**:
  - Lịch sử hội thoại được lưu trong bộ nhớ (in-memory Map) cho phiên làm việc hiện tại.
  - (Future) Lưu vào database để truy xuất lại sau khi đăng nhập.

## Main Flow

1. **Actor mở Chatbot**: Nhấn vào floating widget trên giao diện.

2. **Hệ thống hiển thị cửa sổ chat**: Tin nhắn chào mừng và tạo conversationId mới.

3. **Actor nhập câu hỏi/cung cấp dữ liệu sức khỏe**: Đặt câu hỏi về BMI, huyết áp, đường huyết hoặc sức khỏe tổng quát (có hoặc không kèm dữ liệu).

4. **Hệ thống xử lý và trả lời**:
   - Phát hiện Intent từ câu hỏi (BMI_INQUIRY, BLOOD_PRESSURE_INQUIRY, BLOOD_SUGAR_INQUIRY, GENERAL_HEALTH_INQUIRY, HEALTH_ADVICE, UNKNOWN).
   - Nếu có dữ liệu: Tính toán qua Rule-based System → Gửi kết quả cho AI wrapper → Tạo câu trả lời tự nhiên.
   - Nếu không có dữ liệu: Yêu cầu Actor cung cấp thông tin cần thiết.
   - Lưu lịch sử hội thoại với conversationId.

5. **Actor nhận kết quả**: Xem câu trả lời thân thiện kèm kết luận, phân loại, và khuyến cáo chi tiết.

6. **Actor có thể thực hiện thêm**:
   - Đặt câu hỏi follow-up (hệ thống ghi nhớ ngữ cảnh qua conversationId).
   - Yêu cầu phân tích sức khỏe tổng quan (endpoint `/analyze`): Hệ thống tính toán tất cả chỉ số, đánh giá rủi ro (low/medium/high), và đưa ra khuyến nghị ưu tiên.
   - Xem lịch sử hội thoại (tối đa 10 tin nhắn gần nhất).

7. **Actor đóng Chatbot**: Ẩn cửa sổ chat, giữ nguyên conversationId để tiếp tục sau.

---

## Alternate Flow

### AF-1: Chatbot không có AI API Key

**Trigger**: `GEMINI_API_KEY` và `OPENAI_API_KEY` đều không được cấu hình.

**Flow**:

1. Khi khởi tạo service, hệ thống log warning:
   ```
   [WARN] No AI API key found. Please set GEMINI_API_KEY or OPENAI_API_KEY in config YAML file
   ```
2. Khi Actor đặt câu hỏi, hệ thống **bỏ qua AI wrapper** và trả về **formatted rule-based response**:

   ```
   Chỉ số BMI của bạn là 24.22, thuộc nhóm "Thừa cân".

   Bạn đang ở mức thừa cân nhẹ theo chuẩn châu Á...

   Khuyến cáo: Nên duy trì chế độ ăn cân đối, tăng cường vận động...
   ```

3. Response vẫn chứa đầy đủ `data` nhưng `message` không có giọng điệu tự nhiên của AI.

---

### AF-2: Actor cung cấp dữ liệu không đầy đủ

**Trigger**: Actor gửi request thiếu thông tin (VD: chỉ có weight, không có height).

**Flow**:

1. Hệ thống kiểm tra validation:
   - BMI cần: `weight`, `height`, `age`, `gender`
   - Huyết áp cần: `bloodPressureSys`, `bloodPressureDia`
   - Đường huyết cần: `bloodSugar`

2. Nếu thiếu, trả về message yêu cầu bổ sung:
   ```json
   {
     "message": "Để tính chỉ số BMI, tôi cần biết đầy đủ: cân nặng (kg), chiều cao (cm), tuổi và giới tính. Bạn có thể cung cấp thông tin còn thiếu không?",
     "intent": "BMI_INQUIRY",
     "conversationId": "..."
   }
   ```

---

### AF-3: Actor đặt câu hỏi ngoài phạm vi sức khỏe

**Trigger**: Actor hỏi "Thời tiết hôm nay thế nào?" hoặc "Ai là tổng thống Mỹ?"

**Flow**:

1. Hệ thống phát hiện Intent → `UNKNOWN`
2. Không match rule-based system.
3. Gửi sang AI để trả lời chung:

   ```
   Xin lỗi, tôi là trợ lý sức khỏe nên chỉ có thể tư vấn về các vấn đề liên quan đến BMI, huyết áp, đường huyết và sức khỏe tổng quát.

   Bạn có câu hỏi nào về sức khỏe mà tôi có thể giúp không? 😊
   ```

---

### AF-4: AI API trả về lỗi (rate limit, network error)

**Trigger**: Gemini/OpenAI API timeout hoặc vượt quota.

**Flow**:

1. Hệ thống catch exception trong `try-catch` block.
2. Log lỗi:
   ```
   [ERROR] AI API error: AxiosError: Request failed with status code 429
   ```
3. Fallback về formatted rule-based response (không có AI wrapper):

   ```
   Chỉ số BMI của bạn là 24.22, thuộc nhóm "Thừa cân".

   Bạn đang ở mức thừa cân nhẹ...

   Khuyến cáo: Nên duy trì chế độ ăn cân đối...
   ```

4. Trả về response bình thường cho Actor (không hiển thị lỗi technical).

---

## Exception Flow

### EF-1: Hệ thống không thể load ConfigService

**Trigger**: Lỗi cấu hình module, file YAML bị lỗi cú pháp.

**Flow**:

1. Application không khởi động được, throw exception:
   ```
   [ERROR] Failed to load configuration: YAMLException: ...
   ```
2. Hệ thống dừng lại, hiển thị error log trong console.
3. **Resolution**: Dev cần kiểm tra `configs/local.yaml` có đúng cú pháp không.

---

### EF-2: Dữ liệu đầu vào không hợp lệ (validation error)

**Trigger**: Actor gửi `weight: -10` hoặc `height: 300`.

**Flow**:

1. NestJS ValidationPipe kiểm tra DTO:

   ```typescript
   @Min(1)
   @Max(500)
   weight: number;

   @Min(30)
   @Max(300)
   height: number;
   ```

2. Nếu vi phạm, trả về HTTP 400 Bad Request:

   ```json
   {
     "statusCode": 400,
     "message": [
       "weight must not be less than 1",
       "height must not be greater than 300"
     ],
     "error": "Bad Request"
   }
   ```

3. Frontend hiển thị lỗi validation cho Actor.

---

### EF-3: ConversationId không tồn tại

**Trigger**: Actor gửi `conversationId` đã bị xóa hoặc hết hạn (server restart).

**Flow**:

1. `getConversationHistory(conversationId)` trả về mảng rỗng `[]`.
2. Hệ thống xem như conversation mới, không có lịch sử.
3. Trả lời bình thường nhưng không có context từ các tin nhắn trước.
4. Actor có thể thấy chatbot "quên" ngữ cảnh → Cần implement database persistence.

---

### EF-4: Trẻ em dưới 5 tuổi

**Trigger**: Actor nhập `age: 3` để tính BMI.

**Flow**:

1. `calculateBMI()` phát hiện `age < 5`.
2. Trả về:
   ```json
   {
     "bmi": 16.5,
     "type": "Cần đánh giá chuyên sâu",
     "conclusion": "Với trẻ dưới 5 tuổi, cần sử dụng biểu đồ tăng trưởng WHO chuyên dụng (Z-score) để đánh giá chính xác. Vui lòng tham khảo mục 'Tăng trưởng' hoặc tư vấn bác sĩ nhi khoa.",
     "recommend": "Theo dõi tăng trưởng thường xuyên theo chuẩn WHO"
   }
   ```
3. AI wrapper format lại thành câu tự nhiên:

   ```
   Con bạn còn nhỏ (3 tuổi), việc đánh giá BMI cần dùng biểu đồ tăng trưởng WHO chuyên dụng (Z-score) thay vì chỉ số BMI thông thường.

   Tôi khuyên bạn:
   - Vào mục "Tăng trưởng" để xem biểu đồ chi tiết
   - Hoặc đến bác sĩ nhi khoa để được tư vấn chuyên sâu

   Theo dõi cân nặng và chiều cao định kỳ là rất quan trọng ở độ tuổi này nhé! 👶
   ```

---

## Business Rules

### BR-1: Phân loại BMI theo độ tuổi

- **0-5 tuổi**: Không tính BMI trực tiếp, yêu cầu dùng biểu đồ WHO Z-score.
- **5-19 tuổi**: BMI đơn giản hóa (Bình thường, Thừa cân, Béo phì).
- **20-70 tuổi**: WHO Asia-Pacific Standard.
- **>70 tuổi**: Ngưỡng điều chỉnh cho người cao tuổi (22-27 là lý tưởng).

### BR-2: Phân loại huyết áp (AHA/ESC Guidelines)

| Phân loại         | Tâm thu (mmHg) | Tâm trương (mmHg) |
| ----------------- | -------------- | ----------------- |
| Huyết áp thấp     | < 90           | < 60              |
| Bình thường       | 90-119         | 60-79             |
| Tiền cao huyết áp | 120-139        | 80-89             |
| Cao huyết áp độ 1 | 140-159        | 90-99             |
| Cao huyết áp độ 2 | 160-179        | 100-109           |
| Cao huyết áp độ 3 | ≥ 180          | ≥ 110             |

### BR-3: Phân loại đường huyết (ADA Guidelines)

**Đường huyết lúc đói (Fasting):**

- Bình thường: < 100 mg/dL
- Tiền tiểu đường: 100-125 mg/dL
- Tiểu đường: ≥ 126 mg/dL

**Đường huyết sau ăn 2h (Postprandial):**

- Bình thường: < 140 mg/dL
- Tiền tiểu đường: 140-199 mg/dL
- Tiểu đường: ≥ 200 mg/dL

### BR-4: Risk Score Calculation

```javascript
riskScore = 0
if (BMI < 18.5 || BMI >= 25) riskScore++
if (BP_sys >= 140 || BP_dia >= 90) riskScore++
if (bloodSugar >= 126 fasting || >= 200 postprandial) riskScore++

if (riskScore === 0) → "low"
if (riskScore === 1) → "medium"
if (riskScore >= 2) → "high"
```

### BR-5: Conversation History Limit

- Lưu tối đa **10 tin nhắn** (5 cặp user-assistant) gần nhất.
- Khi vượt quá, xóa tin nhắn cũ nhất (FIFO).
- (Future) Lưu vào database để không bị mất khi server restart.

### BR-6: AI Provider Priority

1. **Gemini 2.0 Flash** (ưu tiên) - Miễn phí, 15 requests/minute.
2. **OpenAI GPT-3.5** (fallback) - Có phí, nhanh hơn.
3. **Formatted Rule-based** (cuối cùng) - Không cần API key.

---

## Technical Notes

### API Endpoints

```
POST /client/chatbot/chat
POST /client/chatbot/analyze
```

### Architecture

```
Client → ChatbotController → AIChatbotService → HealthChatbotService
                                    ↓
                             Gemini/OpenAI API
```

### Dependencies

- `@nestjs/common`, `@nestjs/config`
- `axios` (HTTP client)
- `class-validator` (DTO validation)
- `js-yaml` (YAML config loader)

### Configuration (configs/local.yaml)

```yaml
GEMINI_API_KEY: AIzaSy...abc123
OPENAI_API_KEY: sk-proj-...xyz789 # Optional
```

---

## Future Enhancements (Phase 2)

- [ ] Database persistence for conversation history
- [ ] User authentication integration (JWT)
- [ ] Voice input/output (Speech-to-Text, Text-to-Speech)
- [ ] Multi-language support (English, Vietnamese)
- [ ] Custom model training with user data
- [ ] Integration with wearable devices (Fitbit, Apple Watch)
- [ ] Scheduled health reminders via chatbot
- [ ] Export conversation to PDF/Email
