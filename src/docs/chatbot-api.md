# Health Chatbot API - Phase 1

## Tổng quan

Chatbot AI sức khỏe sử dụng rule-based system kết hợp AI wrapper (OpenAI/Gemini)

## Kiến trúc

```
Client → Controller → AI Service → Rule-based Service
                          ↓
                    OpenAI/Gemini API
```

## API Endpoints

### 1. POST /client/chatbot/chat

Chat với AI chatbot

**Request:**

```json
{
  "message": "Chỉ số BMI của tôi là bao nhiêu?",
  "healthData": {
    "weight": 70,
    "height": 170,
    "age": 25,
    "gender": "nam"
  },
  "conversationId": "conv_xxx" // optional
}
```

**Response:**

```json
{
  "message": "Dựa trên chiều cao 170cm và cân nặng 70kg, chỉ số BMI của bạn là 24.22...",
  "intent": "BMI_INQUIRY",
  "data": {
    "bmi": 24.22,
    "type": "Bình thường",
    "conclusion": "Cân nặng của bạn ở mức lý tưởng",
    "recommend": "Duy trì chế độ ăn uống cân bằng..."
  },
  "conversationId": "conv_xxx",
  "timestamp": "2025-12-21T10:30:00Z"
}
```

### 2. POST /client/chatbot/analyze

Phân tích tổng quan sức khỏe

**Request:**

```json
{
  "weight": 70,
  "height": 170,
  "age": 25,
  "gender": "nam",
  "bloodPressureSys": 130,
  "bloodPressureDia": 85,
  "bloodSugar": 110
}
```

## Cấu hình

### Environment Variables

Thêm vào file `.env`:

```env
# AI Provider - Chọn một trong hai
GEMINI_API_KEY=your_gemini_api_key_here
# HOẶC
OPENAI_API_KEY=your_openai_api_key_here
```

### Lấy API Key

**Google Gemini (FREE):**

1. Truy cập: https://makersuite.google.com/app/apikey
2. Tạo API key mới
3. Copy và paste vào `.env`

**OpenAI (Có phí):**

1. Truy cập: https://platform.openai.com/api-keys
2. Tạo API key mới
3. Copy và paste vào `.env`

## Intents hỗ trợ

1. **BMI_INQUIRY** - Hỏi về BMI
   - Keywords: bmi, cân nặng, chiều cao, béo, gầy
2. **BLOOD_PRESSURE_INQUIRY** - Hỏi về huyết áp
   - Keywords: huyết áp, cao huyết áp, tâm thu, tâm trương
3. **BLOOD_SUGAR_INQUIRY** - Hỏi về đường huyết
   - Keywords: đường huyết, tiểu đường, glucose, hba1c
4. **GENERAL_HEALTH_INQUIRY** - Phân tích tổng quan
   - Keywords: sức khỏe, tình trạng
5. **HEALTH_ADVICE** - Xin lời khuyên
   - Keywords: lời khuyên, nên làm gì, cải thiện

## Test API

### Với Postman/Insomnia:

```bash
POST http://localhost:3000/client/chatbot/chat
Content-Type: application/json

{
  "message": "Tôi cao 170cm, nặng 80kg, 30 tuổi. BMI của tôi thế nào?",
  "healthData": {
    "weight": 80,
    "height": 170,
    "age": 30,
    "gender": "nam"
  }
}
```

### Với cURL:

```bash
curl -X POST http://localhost:3000/client/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tôi cao 170cm, nặng 80kg, 30 tuổi. BMI của tôi thế nào?",
    "healthData": {
      "weight": 80,
      "height": 170,
      "age": 30,
      "gender": "nam"
    }
  }'
```

## Features

✅ Rule-based health analysis (BMI, huyết áp, đường huyết)
✅ AI-powered natural language responses
✅ Intent detection từ câu hỏi
✅ Conversation history tracking
✅ Hỗ trợ cả OpenAI và Gemini
✅ Fallback responses khi không có AI key
✅ Swagger documentation

## Workflow

1. User gửi tin nhắn
2. System phát hiện intent
3. Rule-based engine tính toán kết quả
4. AI wrapper tạo câu trả lời tự nhiên
5. Trả về response cho user

## Next Steps (Phase 2)

- [ ] Lưu lịch sử chat vào database
- [ ] Tích hợp với user authentication
- [ ] Thêm voice input/output
- [ ] Train custom model với dữ liệu riêng
- [ ] Tách sang FastAPI cho AI service
- [ ] RAG với vector database
