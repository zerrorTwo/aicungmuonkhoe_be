# Chat AI Documentation

## Tổng quan

Hệ thống chat AI với 2 chế độ:

1. **Phân tích chỉ số**: Phân tích BMI, huyết áp, đường huyết từ dữ liệu người dùng
2. **Hỏi đáp**: Chat tự do về sức khỏe

## Cấu trúc File

### Backend

- **Controller**: `src/controllers/client/chatbot.controller.ts`
  - `POST /client/chatbot/chat` - Chat với AI
  - `POST /client/chatbot/analyze` - Phân tích tổng quan sức khỏe

- **Service**: `src/services/ai-chatbot.service.ts`
  - Tích hợp Mistral AI
  - Kết hợp rule-based system với AI

### Frontend

- **Component**: `src/components/chat/ChatPopup.tsx`
  - Icon chat floating ở góc phải màn hình
  - Popup chat với 2 chế độ
  - Auto lấy dữ liệu sức khỏe từ profile người dùng

- **API Service**: `src/services/chat.service.ts`
  - `chatWithAI()` - Gọi API chat
  - `analyzeHealth()` - Gọi API phân tích

- **Types**: `src/types/chat.type.ts`
  - Định nghĩa các interface cho chat

## API Endpoints

### 1. Chat với AI

```
POST /client/chatbot/chat
```

**Request Body:**

```json
{
  "message": "BMI của tôi thế nào?",
  "healthData": {
    "weight": 70,
    "height": 170,
    "age": 25,
    "gender": "male",
    "bloodPressureSys": 120,
    "bloodPressureDia": 80,
    "bloodSugar": 90
  },
  "conversationId": "conv_123456" // Optional
}
```

**Response:**

```json
{
  "message": "Chỉ số BMI của bạn là 24.2...",
  "intent": "BMI_INQUIRY",
  "data": {
    "bmi": 24.2,
    "type": "Bình thường",
    "conclusion": "...",
    "recommend": "..."
  },
  "conversationId": "conv_123456",
  "timestamp": "2025-12-24T10:00:00.000Z"
}
```

### 2. Phân tích sức khỏe

```
POST /client/chatbot/analyze
```

**Request Body:**

```json
{
  "weight": 70,
  "height": 170,
  "age": 25,
  "gender": "male",
  "bloodPressureSys": 120,
  "bloodPressureDia": 80,
  "bloodSugar": 90
}
```

**Response:**

```json
{
  "message": "📊 Phân tích sức khỏe tổng quan...",
  "data": {
    "summary": "Tình trạng sức khỏe của bạn tốt...",
    "details": [...],
    "overallRisk": "low",
    "recommendations": [...]
  },
  "summary": "...",
  "timestamp": "2025-12-24T10:00:00.000Z"
}
```

## Cách sử dụng

### Ở Client

1. Click vào icon chat floating ở góc phải màn hình
2. Chọn chế độ:
   - **Phân tích chỉ số**: Tự động lấy dữ liệu BMI từ profile
   - **Hỏi đáp**: Chat tự do
3. Nhập câu hỏi và nhận câu trả lời

### Chế độ Phân tích

- Tự động lấy dữ liệu sức khỏe từ profile người dùng
- Nếu không có dữ liệu, model sẽ tự trả lời dựa trên câu hỏi
- Hỗ trợ phân tích: BMI, huyết áp, đường huyết

### Chế độ Hỏi đáp

- Chat tự do về sức khỏe
- Không cần dữ liệu health data
- Model trả lời dựa trên kiến thức tổng quát

## Tích hợp Mistral AI

### Configuration

Cần thiết lập `MISTRAL_API_KEY` trong file config YAML:

```yaml
MISTRAL_API_KEY: your_api_key_here
```

### Models

- Default: `mistral-small-latest`
- High accuracy: `mistral-large-latest`

### Features

- Temperature: 0.7
- Max tokens: 500
- Multi-turn conversation support
- Context-aware responses

## Lưu ý

1. User cần đăng nhập để sử dụng chat
2. Dữ liệu sức khỏe lấy từ profile của user
3. Conversation ID tự động được tạo và duy trì trong session
4. Chat history được lưu tối đa 10 tin nhắn
