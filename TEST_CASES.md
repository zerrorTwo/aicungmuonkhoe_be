# 🤖 Chatbot API - Test Cases

## Quick Test (Copy & Paste vào Terminal)

### 1️⃣ Chào hỏi đơn giản

```bash
curl -X POST http://localhost:5000/client/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Chào bạn, bạn là ai?"}'
```

### 2️⃣ BMI - Người trưởng thành bình thường

```bash
curl -X POST http://localhost:5000/client/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "BMI của tôi thế nào?",
    "healthData": {
      "weight": 70,
      "height": 170,
      "age": 25,
      "gender": "nam"
    }
  }'
```

### 3️⃣ BMI - Người thừa cân

```bash
curl -X POST http://localhost:5000/client/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tôi cao 165cm, nặng 75kg, 35 tuổi. Tôi có béo không?",
    "healthData": {
      "weight": 75,
      "height": 165,
      "age": 35,
      "gender": "nữ"
    }
  }'
```

### 4️⃣ Huyết áp - Tiền cao huyết áp

```bash
curl -X POST http://localhost:5000/client/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Huyết áp 130/85 có bình thường không?",
    "healthData": {
      "bloodPressureSys": 130,
      "bloodPressureDia": 85
    }
  }'
```

### 5️⃣ Đường huyết - Tiền tiểu đường

```bash
curl -X POST http://localhost:5000/client/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Đường huyết đói 110mg/dL có cao không?",
    "healthData": {
      "bloodSugar": 110
    }
  }'
```

### 6️⃣ Phân tích tổng quan - Nhiều vấn đề

```bash
curl -X POST http://localhost:5000/client/chatbot/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 85,
    "height": 170,
    "age": 45,
    "gender": "nam",
    "bloodPressureSys": 145,
    "bloodPressureDia": 95,
    "bloodSugar": 130
  }'
```

### 7️⃣ Phân tích tổng quan - Tất cả chỉ số tốt

```bash
curl -X POST http://localhost:5000/client/chatbot/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 65,
    "height": 170,
    "age": 28,
    "gender": "nữ",
    "bloodPressureSys": 115,
    "bloodPressureDia": 75,
    "bloodSugar": 90
  }'
```

### 8️⃣ BMI trẻ em (10 tuổi)

```bash
curl -X POST http://localhost:5000/client/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Con tôi 10 tuổi, cao 140cm, nặng 50kg",
    "healthData": {
      "weight": 50,
      "height": 140,
      "age": 10,
      "gender": "nam"
    }
  }'
```

### 9️⃣ BMI người cao tuổi (75 tuổi)

```bash
curl -X POST http://localhost:5000/client/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Ông tôi 75 tuổi, cao 168cm, nặng 62kg",
    "healthData": {
      "weight": 62,
      "height": 168,
      "age": 75,
      "gender": "nam"
    }
  }'
```

### 🔟 Conversation - Test ngữ cảnh

```bash
# Câu 1
curl -X POST http://localhost:5000/client/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "BMI của tôi là bao nhiêu?",
    "healthData": {
      "weight": 70,
      "height": 170,
      "age": 25,
      "gender": "nam"
    },
    "conversationId": "test123"
  }'

# Câu 2 (follow-up, có nhớ context)
curl -X POST http://localhost:5000/client/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Vậy tôi nên làm gì?",
    "conversationId": "test123"
  }'
```

---

## 🚀 Chạy tất cả test cases

### Linux/Mac:

```bash
chmod +x test-chatbot.sh
./test-chatbot.sh
```

### Windows PowerShell:

```powershell
.\test-chatbot.ps1
```

### Windows CMD:

```cmd
# Test từng command một, copy từ phần Quick Test ở trên
```

---

## 📊 Expected Results

### ✅ BMI Bình thường (70kg, 170cm, 25 tuổi)

```json
{
  "bmi": 24.22,
  "type": "Bình thường",
  "conclusion": "Cân nặng của bạn ở mức lý tưởng",
  "recommend": "Duy trì chế độ ăn uống cân bằng..."
}
```

### ⚠️ BMI Thừa cân (75kg, 165cm, 35 tuổi)

```json
{
  "bmi": 27.55,
  "type": "Béo phì độ I",
  "conclusion": "Bạn đang thừa cân ở mức độ nhẹ",
  "recommend": "Cần giảm cân bằng chế độ ăn kiêng..."
}
```

### 🔴 Phân tích nguy cơ cao

```json
{
  "overallRisk": "high",
  "summary": "Tình trạng sức khỏe của bạn cần được chú ý nghiêm túc...",
  "details": [...],
  "recommendations": [...]
}
```
