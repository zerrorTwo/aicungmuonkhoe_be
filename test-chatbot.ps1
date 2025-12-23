# Test Chatbot API - Windows PowerShell

$BASE_URL = "http://localhost:5000/client/chatbot"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "🤖 CHATBOT API TEST" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Test 1: Chat đơn giản - Chào hỏi
Write-Host "`n📝 Test 1: Chào hỏi" -ForegroundColor Yellow
curl.exe -X POST "$BASE_URL/chat" `
  -H "Content-Type: application/json" `
  -d '{\"message\": \"Chào bạn, bạn là ai?\"}'

Start-Sleep -Seconds 1

# Test 2: Hỏi về BMI với dữ liệu
Write-Host "`n📝 Test 2: Hỏi về BMI (có dữ liệu)" -ForegroundColor Yellow
curl.exe -X POST "$BASE_URL/chat" `
  -H "Content-Type: application/json" `
  -d '{\"message\": \"Chỉ số BMI của tôi thế nào?\", \"healthData\": {\"weight\": 70, \"height\": 170, \"age\": 25, \"gender\": \"nam\"}}'

Start-Sleep -Seconds 1

# Test 3: Hỏi về BMI không có dữ liệu
Write-Host "`n📝 Test 3: Hỏi về BMI (không có dữ liệu)" -ForegroundColor Yellow
curl.exe -X POST "$BASE_URL/chat" `
  -H "Content-Type: application/json" `
  -d '{\"message\": \"BMI của tôi là bao nhiêu?\"}'

Start-Sleep -Seconds 1

# Test 4: Huyết áp
Write-Host "`n📝 Test 4: Hỏi về huyết áp" -ForegroundColor Yellow
curl.exe -X POST "$BASE_URL/chat" `
  -H "Content-Type: application/json" `
  -d '{\"message\": \"Huyết áp của tôi có bình thường không?\", \"healthData\": {\"bloodPressureSys\": 130, \"bloodPressureDia\": 85}}'

Start-Sleep -Seconds 1

# Test 5: Đường huyết
Write-Host "`n📝 Test 5: Hỏi về đường huyết" -ForegroundColor Yellow
curl.exe -X POST "$BASE_URL/chat" `
  -H "Content-Type: application/json" `
  -d '{\"message\": \"Đường huyết của tôi thế nào?\", \"healthData\": {\"bloodSugar\": 110}}'

Start-Sleep -Seconds 1

# Test 6: Phân tích tổng quan
Write-Host "`n📝 Test 6: Phân tích tổng quan sức khỏe" -ForegroundColor Yellow
curl.exe -X POST "$BASE_URL/analyze" `
  -H "Content-Type: application/json" `
  -d '{\"weight\": 80, \"height\": 170, \"age\": 30, \"gender\": \"nam\", \"bloodPressureSys\": 135, \"bloodPressureDia\": 88, \"bloodSugar\": 115}'

Start-Sleep -Seconds 1

# Test 7: Trẻ em béo phì
Write-Host "`n📝 Test 7: BMI trẻ em (10 tuổi, béo phì)" -ForegroundColor Yellow
curl.exe -X POST "$BASE_URL/chat" `
  -H "Content-Type: application/json" `
  -d '{\"message\": \"Con tôi 10 tuổi, cao 140cm, nặng 50kg. Có béo không?\", \"healthData\": {\"weight\": 50, \"height\": 140, \"age\": 10, \"gender\": \"nam\"}}'

Start-Sleep -Seconds 1

# Test 8: Người cao tuổi
Write-Host "`n📝 Test 8: BMI người cao tuổi (75 tuổi)" -ForegroundColor Yellow
curl.exe -X POST "$BASE_URL/chat" `
  -H "Content-Type: application/json" `
  -d '{\"message\": \"Cân nặng của tôi có phù hợp không?\", \"healthData\": {\"weight\": 65, \"height\": 165, \"age\": 75, \"gender\": \"nữ\"}}'

Start-Sleep -Seconds 1

# Test 9: Conversation
Write-Host "`n📝 Test 9: Conversation - Câu 1" -ForegroundColor Yellow
$convId = "test_conv_$(Get-Date -Format 'yyyyMMddHHmmss')"
curl.exe -X POST "$BASE_URL/chat" `
  -H "Content-Type: application/json" `
  -d "{`"message`": `"BMI của tôi là bao nhiêu?`", `"healthData`": {`"weight`": 70, `"height`": 170, `"age`": 25, `"gender`": `"nam`"}, `"conversationId`": `"$convId`"}"

Start-Sleep -Seconds 2

Write-Host "`n📝 Test 9: Conversation - Câu 2 (follow-up)" -ForegroundColor Yellow
curl.exe -X POST "$BASE_URL/chat" `
  -H "Content-Type: application/json" `
  -d "{`"message`": `"Vậy tôi nên làm gì?`", `"conversationId`": `"$convId`"}"

Start-Sleep -Seconds 1

# Test 10: Tất cả chỉ số tốt
Write-Host "`n📝 Test 10: Phân tích - Tất cả chỉ số tốt" -ForegroundColor Yellow
curl.exe -X POST "$BASE_URL/analyze" `
  -H "Content-Type: application/json" `
  -d '{\"weight\": 65, \"height\": 170, \"age\": 28, \"gender\": \"nữ\", \"bloodPressureSys\": 115, \"bloodPressureDia\": 75, \"bloodSugar\": 90}'

Write-Host "`n======================================" -ForegroundColor Cyan
Write-Host "✅ TEST COMPLETED" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
