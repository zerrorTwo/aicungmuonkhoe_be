# Postman Test Requests - Health Chatbot API

Copy từng request vào Postman để test. Mỗi request bao gồm Method, URL, Headers, và Body.

---

## 1. Chào hỏi đơn giản

**Method:** `POST`  
**URL:** `http://localhost:5000/client/chatbot/chat`  
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "message": "Chào bạn, bạn là ai?"
}
```

---

## 2. BMI - Người trưởng thành bình thường (70kg, 170cm, 25 tuổi)

**Method:** `POST`  
**URL:** `http://localhost:5000/client/chatbot/chat`  
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "message": "Chỉ số BMI của tôi thế nào?",
  "healthData": {
    "weight": 70,
    "height": 170,
    "age": 25,
    "gender": "nam"
  }
}
```

---

## 3. BMI - Không có dữ liệu

**Method:** `POST`  
**URL:** `http://localhost:5000/client/chatbot/chat`  
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "message": "BMI của tôi là bao nhiêu?"
}
```

---

## 4. BMI - Người thừa cân (75kg, 165cm, 35 tuổi, nữ)

**Method:** `POST`  
**URL:** `http://localhost:5000/client/chatbot/chat`  
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "message": "Tôi cao 165cm, nặng 75kg, 35 tuổi. Tôi có béo không?",
  "healthData": {
    "weight": 75,
    "height": 165,
    "age": 35,
    "gender": "nữ"
  }
}
```

---

## 5. BMI - Trẻ em 10 tuổi (50kg, 140cm)

**Method:** `POST`  
**URL:** `http://localhost:5000/client/chatbot/chat`  
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "message": "Con tôi 10 tuổi, cao 140cm, nặng 50kg. Có béo không?",
  "healthData": {
    "weight": 50,
    "height": 140,
    "age": 10,
    "gender": "nam"
  }
}
```

---

## 6. BMI - Người cao tuổi 75 tuổi (65kg, 165cm, nữ)

**Method:** `POST`  
**URL:** `http://localhost:5000/client/chatbot/chat`  
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "message": "Cân nặng của tôi có phù hợp không?",
  "healthData": {
    "weight": 65,
    "height": 165,
    "age": 75,
    "gender": "nữ"
  }
}
```

---

## 7. Huyết áp - Tiền cao huyết áp (130/85)

**Method:** `POST`  
**URL:** `http://localhost:5000/client/chatbot/chat`  
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "message": "Huyết áp của tôi có bình thường không?",
  "healthData": {
    "bloodPressureSys": 130,
    "bloodPressureDia": 85
  }
}
```

---

## 8. Huyết áp - Cao huyết áp độ 1 (145/95)

**Method:** `POST`  
**URL:** `http://localhost:5000/client/chatbot/chat`  
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "message": "Huyết áp 145/95 có nguy hiểm không?",
  "healthData": {
    "bloodPressureSys": 145,
    "bloodPressureDia": 95
  }
}
```

---

## 9. Đường huyết - Bình thường (95 mg/dL)

**Method:** `POST`  
**URL:** `http://localhost:5000/client/chatbot/chat`  
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "message": "Đường huyết của tôi thế nào?",
  "healthData": {
    "bloodSugar": 95
  }
}
```

---

## 10. Đường huyết - Tiền tiểu đường (110 mg/dL)

**Method:** `POST`  
**URL:** `http://localhost:5000/client/chatbot/chat`  
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "message": "Đường huyết đói 110mg/dL có cao không?",
  "healthData": {
    "bloodSugar": 110
  }
}
```

---

## 11. Đường huyết - Tiểu đường (140 mg/dL)

**Method:** `POST`  
**URL:** `http://localhost:5000/client/chatbot/chat`  
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "message": "Đường huyết 140mg/dL có nguy hiểm không?",
  "healthData": {
    "bloodSugar": 140
  }
}
```

---

## 12. Conversation - Câu hỏi đầu tiên

**Method:** `POST`  
**URL:** `http://localhost:5000/client/chatbot/chat`  
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "message": "BMI của tôi là bao nhiêu?",
  "healthData": {
    "weight": 70,
    "height": 170,
    "age": 25,
    "gender": "nam"
  },
  "conversationId": "test_conv_001"
}
```

---

## 13. Conversation - Câu hỏi tiếp theo (test context)

**Method:** `POST`  
**URL:** `http://localhost:5000/client/chatbot/chat`  
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "message": "Vậy tôi nên làm gì để duy trì?",
  "conversationId": "test_conv_001"
}
```

---

# ANALYZE ENDPOINT - Phân tích tổng hợp

## 14. Phân tích - Tất cả chỉ số tốt ✅

**Method:** `POST`  
**URL:** `http://localhost:5000/client/chatbot/analyze`  
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "weight": 65,
  "height": 170,
  "age": 28,
  "gender": "nữ",
  "bloodPressureSys": 115,
  "bloodPressureDia": 75,
  "bloodSugar": 90
}
```

---

## 15. Phân tích - Nguy cơ trung bình ⚠️

**Method:** `POST`  
**URL:** `http://localhost:5000/client/chatbot/analyze`  
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "weight": 78,
  "height": 170,
  "age": 40,
  "gender": "nam",
  "bloodPressureSys": 135,
  "bloodPressureDia": 88,
  "bloodSugar": 105
}
```

---

## 16. Phân tích - Nguy cơ cao 🔴

**Method:** `POST`  
**URL:** `http://localhost:5000/client/chatbot/analyze`  
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "weight": 95,
  "height": 170,
  "age": 50,
  "gender": "nam",
  "bloodPressureSys": 155,
  "bloodPressureDia": 100,
  "bloodSugar": 140
}
```

---

## 17. Phân tích - Chỉ có BMI

**Method:** `POST`  
**URL:** `http://localhost:5000/client/chatbot/analyze`  
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "weight": 70,
  "height": 175,
  "age": 30,
  "gender": "nam"
}
```

---

## 18. Phân tích - Trẻ em 12 tuổi

**Method:** `POST`  
**URL:** `http://localhost:5000/client/chatbot/analyze`  
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "weight": 45,
  "height": 150,
  "age": 12,
  "gender": "nữ",
  "bloodPressureSys": 110,
  "bloodPressureDia": 70,
  "bloodSugar": 85
}
```

---

## 19. Phân tích - Người cao tuổi 72 tuổi

**Method:** `POST`  
**URL:** `http://localhost:5000/client/chatbot/analyze`  
**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "weight": 68,
  "height": 168,
  "age": 72,
  "gender": "nam",
  "bloodPressureSys": 140,
  "bloodPressureDia": 85,
  "bloodSugar": 110
}
```

---

## Hướng dẫn test trong Postman:

1. Mở Postman → New Request
2. Chọn Method (POST)
3. Paste URL
4. Vào tab **Headers** → thêm `Content-Type: application/json`
5. Vào tab **Body** → chọn **raw** → chọn **JSON** từ dropdown
6. Copy paste JSON body
7. Click **Send**

### Test conversation context (quan trọng):

- Chạy request #12 trước
- Lưu lại `conversationId` từ response
- Chạy request #13 với cùng `conversationId` để test chatbot có nhớ context không

### Expected results:

- `/chat`: Response có `message` (câu trả lời tự nhiên), `intent`, `data` (kết quả tính toán)
- `/analyze`: Response có `summary`, `details[]`, `overallRisk`, `recommendations[]`
