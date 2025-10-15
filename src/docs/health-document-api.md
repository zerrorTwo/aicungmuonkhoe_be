# Health Document API

## 1. Tạo health document

**POST** `/api/health-document`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request:**

```json
{
  "NAME": "Nguyễn Văn A",
  "FULL_NAME": "Nguyễn Văn A",
  "DOB": "1990-01-01",
  "PHONE": "0123456789",
  "HEIGHT": "170",
  "WEIGHT": "65",
  "GENDER_ID": 1,
  "HEALTH_STATUS": "Tốt"
}
```

**Response:**

```json
{
  "data": {
    "ID": 1,
    "NAME": "Nguyễn Văn A",
    "FULL_NAME": "Nguyễn Văn A",
    "DOB": "1990-01-01",
    "PHONE": "0123456789",
    "HEIGHT": "170",
    "WEIGHT": "65"
  },
  "message": "Created successfully",
  "status": 200
}
```

## 2. Lấy health document của user

**GET** `/api/health-document/myself`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "data": {
    "ID": 1,
    "NAME": "Nguyễn Văn A",
    "FULL_NAME": "Nguyễn Văn A",
    "DOB": "1990-01-01",
    "PHONE": "0123456789",
    "HEIGHT": "170",
    "WEIGHT": "65",
    "HEALTH_STATUS": "Tốt"
  },
  "message": "Retrieved successfully",
  "status": 200
}
```

## 3. Lấy health document theo ID

**GET** `/api/health-document/:id`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "data": {
    "ID": 1,
    "NAME": "Nguyễn Văn A",
    "FULL_NAME": "Nguyễn Văn A",
    "DOB": "1990-01-01",
    "PHONE": "0123456789",
    "HEIGHT": "170",
    "WEIGHT": "65",
    "USER": {
      "USER_ID": 1,
      "EMAIL": "user@example.com"
    },
    "GENDER": {
      "ID": 1,
      "NAME": "Nam"
    }
  },
  "message": "Retrieved successfully",
  "status": 200
}
```

## 4. Cập nhật health document

**PUT** `/api/health-document/:id`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request:**

```json
{
  "HEIGHT": "175",
  "WEIGHT": "70",
  "HEALTH_STATUS": "Rất tốt"
}
```

**Response:**

```json
{
  "data": {
    "ID": 1,
    "HEIGHT": "175",
    "WEIGHT": "70",
    "HEALTH_STATUS": "Rất tốt"
  },
  "message": "Updated successfully",
  "status": 200
}
```

- `HEIGHT`: Required, số thực > 0 (cm)
- `WEIGHT`: Required, số thực > 0 (kg)
- `BLOOD_GROUP`: Optional, một trong ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
- `ALLERGIES`: Optional, chuỗi mô tả dị ứng
- `MEDICAL_HISTORY`: Optional, tiền sử bệnh
- `CURRENT_MEDICATIONS`: Optional, thuốc đang sử dụng
- `EMERGENCY_CONTACT`: Optional, liên hệ khẩn cấp
- `INSURANCE_INFO`: Optional, thông tin bảo hiểm
- `NOTES`: Optional, ghi chú thêm

#### Response

**Success (200):**

```json
{
  "data": {
    "id": 1,
    "user_id": 1,
    "HEIGHT": 170,
    "WEIGHT": 65,
    "BLOOD_GROUP": "A+",
    "BMI": 22.5,
    "ALLERGIES": "Không có dị ứng đặc biệt",
    "MEDICAL_HISTORY": "Tiền sử bệnh tim gia đình",
    "CURRENT_MEDICATIONS": "Thuốc huyết áp Amlodipine 5mg",
    "EMERGENCY_CONTACT": "Nguyễn Văn A - 0123456789",
    "INSURANCE_INFO": "Bảo hiểm y tế xã hội",
    "NOTES": "Cần theo dõi huyết áp định kỳ",
    "created_at": "2025-10-12T00:00:00Z",
    "updated_at": "2025-10-12T00:00:00Z"
  },
  "message": "Tạo hồ sơ sức khỏe thành công",
  "status": 200
}
```

**Error (400):**

```json
{
  "statusCode": 400,
  "message": ["HEIGHT phải là số lớn hơn 0", "WEIGHT phải là số lớn hơn 0"],
  "error": "Bad Request"
}
```

---

### 2. Lấy Hồ Sơ Sức Khỏe Cá Nhân

**GET** `/api/health-document/myself`

Lấy hồ sơ sức khỏe của user hiện tại.

#### Request

**Headers:**

```
Authorization: Bearer <jwt_token>
```

#### Response

**Success (200):**

```json
{
  "data": {
    "id": 1,
    "user_id": 1,
    "HEIGHT": 170,
    "WEIGHT": 65,
    "BLOOD_GROUP": "A+",
    "BMI": 22.5,
    "ALLERGIES": "Không có dị ứng đặc biệt",
    "MEDICAL_HISTORY": "Tiền sử bệnh tim gia đình",
    "CURRENT_MEDICATIONS": "Thuốc huyết áp Amlodipine 5mg",
    "EMERGENCY_CONTACT": "Nguyễn Văn A - 0123456789",
    "INSURANCE_INFO": "Bảo hiểm y tế xã hội",
    "NOTES": "Cần theo dõi huyết áp định kỳ",
    "created_at": "2025-10-12T00:00:00Z",
    "updated_at": "2025-10-12T00:00:00Z",
    "user": {
      "user_id": 1,
      "EMAIL": "user@example.com",
      "FIRST_NAME": "John",
      "LAST_NAME": "Doe"
    }
  },
  "message": "Lấy hồ sơ sức khỏe thành công",
  "status": 200
}
```

**Error (404):**

```json
{
  "statusCode": 404,
  "message": "Hồ sơ sức khỏe không tồn tại",
  "error": "Not Found"
}
```

---

### 3. Lấy Hồ Sơ Sức Khỏe Theo ID

**GET** `/api/health-document/:id`

Lấy hồ sơ sức khỏe theo ID (chỉ được xem hồ sơ của chính mình hoặc admin).

#### Request

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Parameters:**

- `id` (number): ID của hồ sơ sức khỏe

#### Response

**Success (200):**

```json
{
  "data": {
    "id": 1,
    "user_id": 1,
    "HEIGHT": 170,
    "WEIGHT": 65,
    "BLOOD_GROUP": "A+",
    "BMI": 22.5,
    "ALLERGIES": "Không có dị ứng đặc biệt",
    "MEDICAL_HISTORY": "Tiền sử bệnh tim gia đình",
    "CURRENT_MEDICATIONS": "Thuốc huyết áp Amlodipine 5mg",
    "EMERGENCY_CONTACT": "Nguyễn Văn A - 0123456789",
    "INSURANCE_INFO": "Bảo hiểm y tế xã hội",
    "NOTES": "Cần theo dõi huyết áp định kỳ",
    "created_at": "2025-10-12T00:00:00Z",
    "updated_at": "2025-10-12T00:00:00Z"
  },
  "message": "Lấy hồ sơ sức khỏe thành công",
  "status": 200
}
```

**Error (403):**

```json
{
  "statusCode": 403,
  "message": "Không có quyền truy cập hồ sơ này",
  "error": "Forbidden"
}
```

---

### 4. Cập Nhật Hồ Sơ Sức Khỏe

**PUT** `/api/health-document/:id`

Cập nhật hồ sơ sức khỏe theo ID.

#### Request

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Parameters:**

- `id` (number): ID của hồ sơ sức khỏe

**Body:**

```json
{
  "HEIGHT": 175,
  "WEIGHT": 70,
  "BLOOD_GROUP": "B+",
  "ALLERGIES": "Dị ứng phấn hoa",
  "MEDICAL_HISTORY": "Tiền sử bệnh tim gia đình, bị cảm lạnh thường xuyên",
  "CURRENT_MEDICATIONS": "Thuốc huyết áp Amlodipine 5mg, Vitamin C",
  "EMERGENCY_CONTACT": "Nguyễn Thị B - 0987654321",
  "INSURANCE_INFO": "Bảo hiểm y tế xã hội + Bảo hiểm tư nhân",
  "NOTES": "Cần theo dõi huyết áp định kỳ, kiểm tra tim 6 tháng/lần"
}
```

#### Response

**Success (200):**

```json
{
  "data": {
    "id": 1,
    "user_id": 1,
    "HEIGHT": 175,
    "WEIGHT": 70,
    "BLOOD_GROUP": "B+",
    "BMI": 22.9,
    "ALLERGIES": "Dị ứng phấn hoa",
    "MEDICAL_HISTORY": "Tiền sử bệnh tim gia đình, bị cảm lạnh thường xuyên",
    "CURRENT_MEDICATIONS": "Thuốc huyết áp Amlodipine 5mg, Vitamin C",
    "EMERGENCY_CONTACT": "Nguyễn Thị B - 0987654321",
    "INSURANCE_INFO": "Bảo hiểm y tế xã hội + Bảo hiểm tư nhân",
    "NOTES": "Cần theo dõi huyết áp định kỳ, kiểm tra tim 6 tháng/lần",
    "created_at": "2025-10-12T00:00:00Z",
    "updated_at": "2025-10-12T01:00:00Z"
  },
  "message": "Cập nhật hồ sơ sức khỏe thành công",
  "status": 200
}
```

---

### 5. Xóa Hồ Sơ Sức Khỏe

**DELETE** `/api/health-document/:id`

Xóa hồ sơ sức khỏe theo ID.

#### Request

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Parameters:**

- `id` (number): ID của hồ sơ sức khỏe

#### Response

**Success (200):**

```json
{
  "data": null,
  "message": "Xóa hồ sơ sức khỏe thành công",
  "status": 200
}
```

---

### 6. Lấy Lịch Sử Hồ Sơ Sức Khỏe

**GET** `/api/health-document/history`

Lấy lịch sử thay đổi hồ sơ sức khỏe của user hiện tại.

#### Request

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

- `page` (number, optional): Số trang (default: 1)
- `limit` (number, optional): Số items per page (default: 10)
- `from_date` (string, optional): Ngày bắt đầu (YYYY-MM-DD)
- `to_date` (string, optional): Ngày kết thúc (YYYY-MM-DD)

#### Response

**Success (200):**

```json
{
  "data": {
    "items": [
      {
        "id": 1,
        "HEIGHT": 175,
        "WEIGHT": 70,
        "BMI": 22.9,
        "updated_at": "2025-10-12T01:00:00Z"
      },
      {
        "id": 1,
        "HEIGHT": 170,
        "WEIGHT": 65,
        "BMI": 22.5,
        "updated_at": "2025-10-12T00:00:00Z"
      }
    ],
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "message": "Lấy lịch sử thành công",
  "status": 200
}
```

---

## Data Models

### HealthDocument Entity

```typescript
interface HealthDocument {
  id: number;
  user_id: number;
  HEIGHT: number; // cm
  WEIGHT: number; // kg
  BLOOD_GROUP?: string; // A+, A-, B+, B-, AB+, AB-, O+, O-
  BMI: number; // Calculated automatically
  ALLERGIES?: string;
  MEDICAL_HISTORY?: string;
  CURRENT_MEDICATIONS?: string;
  EMERGENCY_CONTACT?: string;
  INSURANCE_INFO?: string;
  NOTES?: string;
  created_at: Date;
  updated_at: Date;
  user?: User; // Populated when needed
}
```

### BMI Calculation

BMI được tính tự động theo công thức:

```
BMI = WEIGHT (kg) / (HEIGHT (m))²
```

### BMI Categories

| BMI Range   | Category       | Color Code |
| ----------- | -------------- | ---------- |
| < 18.5      | Thiếu cân      | Blue       |
| 18.5 - 24.9 | Bình thường    | Green      |
| 25.0 - 29.9 | Thừa cân       | Yellow     |
| 30.0 - 34.9 | Béo phì độ I   | Orange     |
| 35.0 - 39.9 | Béo phì độ II  | Red        |
| ≥ 40.0      | Béo phì độ III | Dark Red   |

---

## Business Rules

### Data Validation

1. **HEIGHT**: Phải từ 50cm đến 250cm
2. **WEIGHT**: Phải từ 10kg đến 500kg
3. **BLOOD_GROUP**: Chỉ chấp nhận 8 nhóm máu chuẩn
4. **BMI**: Tự động tính và cập nhật khi thay đổi HEIGHT/WEIGHT

### Access Control

1. User chỉ có thể xem/sửa hồ sơ của chính mình
2. Admin có thể xem tất cả hồ sơ
3. Hồ sơ sức khỏe bị xóa sẽ được lưu trong bảng archive

### Data Retention

1. Lịch sử thay đổi được lưu trữ 2 năm
2. Dữ liệu nhạy cảm được mã hóa
3. Backup hàng ngày cho dữ liệu y tế

---

## Error Handling

### Common Errors

| Code | Message      | Description               |
| ---- | ------------ | ------------------------- |
| 400  | Bad Request  | Dữ liệu không hợp lệ      |
| 401  | Unauthorized | Chưa đăng nhập            |
| 403  | Forbidden    | Không có quyền truy cập   |
| 404  | Not Found    | Hồ sơ không tồn tại       |
| 409  | Conflict     | User đã có hồ sơ sức khỏe |

### Validation Error Example

```json
{
  "statusCode": 400,
  "message": [
    "HEIGHT phải từ 50 đến 250 cm",
    "WEIGHT phải từ 10 đến 500 kg",
    "BLOOD_GROUP không hợp lệ"
  ],
  "error": "Bad Request"
}
```

---

## Security & Privacy

### Data Encryption

- Thông tin y tế nhạy cảm được mã hóa AES-256
- Medical history và notes được hash
- Backup data được mã hóa

### Access Logging

- Tất cả truy cập hồ sơ sức khỏe được log
- Log bao gồm: user_id, action, timestamp, IP address
- Log được lưu trữ 5 năm

### HIPAA Compliance

- Tuân thủ các quy định bảo mật y tế
- Audit trail cho mọi thay đổi
- Data anonymization khi cần thiết

---

## Testing

### Unit Tests

```javascript
describe('HealthDocumentController', () => {
  describe('createHealthDocument', () => {
    it('should calculate BMI correctly', () => {
      const height = 170; // cm
      const weight = 65; // kg
      const expectedBMI = 22.5;

      // Test BMI calculation
    });

    it('should validate blood group', () => {
      const invalidBloodGroup = 'XYZ';
      // Test validation
    });
  });
});
```

### cURL Examples

**Create health document:**

```bash
curl -X POST http://localhost:3000/api/health-document \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "HEIGHT": 170,
    "WEIGHT": 65,
    "BLOOD_GROUP": "A+",
    "ALLERGIES": "Không có"
  }'
```

**Get personal health document:**

```bash
curl -X GET http://localhost:3000/api/health-document/myself \
  -H "Authorization: Bearer your_jwt_token"
```

**Update health document:**

```bash
curl -X PUT http://localhost:3000/api/health-document/1 \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "WEIGHT": 70,
    "CURRENT_MEDICATIONS": "Updated medications"
  }'
```

---

## Integration

### External Services

1. **BMI Calculator Service**: Tính BMI và phân loại
2. **Health Analytics**: Phân tích xu hướng sức khỏe
3. **Notification Service**: Cảnh báo khi có thay đổi bất thường

### Webhooks

```javascript
// Example webhook payload when health document updated
{
  "event": "health_document.updated",
  "user_id": 1,
  "health_document_id": 1,
  "changes": {
    "WEIGHT": { "old": 65, "new": 70 },
    "BMI": { "old": 22.5, "new": 24.2 }
  },
  "timestamp": "2025-10-12T00:00:00Z"
}
```

---

## Changelog

### v1.0.0 (2025-10-12)

- Initial health document management
- BMI calculation
- Blood group validation
- History tracking

---

_Cập nhật lần cuối: 12/10/2025_
