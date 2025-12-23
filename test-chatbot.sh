#!/bin/bash

# Test Chatbot API
BASE_URL="http://localhost:5000/client/chatbot"

echo "======================================"
echo "🤖 CHATBOT API TEST"
echo "======================================"

# Test 1: Chat đơn giản - Chào hỏi
echo ""
echo "📝 Test 1: Chào hỏi"
curl -X POST "${BASE_URL}/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Chào bạn, bạn là ai?"
  }'

echo ""
echo "--------------------------------------"

# Test 2: Hỏi về BMI với dữ liệu
echo ""
echo "📝 Test 2: Hỏi về BMI (có dữ liệu)"
curl -X POST "${BASE_URL}/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Chỉ số BMI của tôi thế nào?",
    "healthData": {
      "weight": 70,
      "height": 170,
      "age": 25,
      "gender": "nam"
    }
  }'

echo ""
echo "--------------------------------------"

# Test 3: Hỏi về BMI không có dữ liệu
echo ""
echo "📝 Test 3: Hỏi về BMI (không có dữ liệu)"
curl -X POST "${BASE_URL}/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "BMI của tôi là bao nhiêu?"
  }'

echo ""
echo "--------------------------------------"

# Test 4: Huyết áp
echo ""
echo "📝 Test 4: Hỏi về huyết áp"
curl -X POST "${BASE_URL}/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Huyết áp của tôi có bình thường không?",
    "healthData": {
      "bloodPressureSys": 130,
      "bloodPressureDia": 85
    }
  }'

echo ""
echo "--------------------------------------"

# Test 5: Đường huyết
echo ""
echo "📝 Test 5: Hỏi về đường huyết"
curl -X POST "${BASE_URL}/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Đường huyết của tôi thế nào?",
    "healthData": {
      "bloodSugar": 110
    }
  }'

echo ""
echo "--------------------------------------"

# Test 6: Phân tích tổng quan
echo ""
echo "📝 Test 6: Phân tích tổng quan sức khỏe"
curl -X POST "${BASE_URL}/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 80,
    "height": 170,
    "age": 30,
    "gender": "nam",
    "bloodPressureSys": 135,
    "bloodPressureDia": 88,
    "bloodSugar": 115
  }'

echo ""
echo "--------------------------------------"

# Test 7: Trẻ em béo phì
echo ""
echo "📝 Test 7: BMI trẻ em (10 tuổi, béo phì)"
curl -X POST "${BASE_URL}/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Con tôi 10 tuổi, cao 140cm, nặng 50kg. Có béo không?",
    "healthData": {
      "weight": 50,
      "height": 140,
      "age": 10,
      "gender": "nam"
    }
  }'

echo ""
echo "--------------------------------------"

# Test 8: Người cao tuổi
echo ""
echo "📝 Test 8: BMI người cao tuổi (75 tuổi)"
curl -X POST "${BASE_URL}/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Cân nặng của tôi có phù hợp không?",
    "healthData": {
      "weight": 65,
      "height": 165,
      "age": 75,
      "gender": "nữ"
    }
  }'

echo ""
echo "--------------------------------------"

# Test 9: Conversation với conversationId
echo ""
echo "📝 Test 9: Conversation - Câu 1"
CONV_ID="test_conv_$(date +%s)"
curl -X POST "${BASE_URL}/chat" \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"BMI của tôi là bao nhiêu?\",
    \"healthData\": {
      \"weight\": 70,
      \"height\": 170,
      \"age\": 25,
      \"gender\": \"nam\"
    },
    \"conversationId\": \"${CONV_ID}\"
  }"

echo ""
echo ""
echo "📝 Test 9: Conversation - Câu 2 (follow-up)"
curl -X POST "${BASE_URL}/chat" \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"Vậy tôi nên làm gì?\",
    \"conversationId\": \"${CONV_ID}\"
  }"

echo ""
echo "--------------------------------------"

# Test 10: Tất cả chỉ số tốt
echo ""
echo "📝 Test 10: Phân tích - Tất cả chỉ số tốt"
curl -X POST "${BASE_URL}/analyze" \
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

echo ""
echo "======================================"
echo "✅ TEST COMPLETED"
echo "======================================"
