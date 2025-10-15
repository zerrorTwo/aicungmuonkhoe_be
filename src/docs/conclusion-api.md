# Conclusion API

## 1. Tạo conclusion

**POST** `/api/conclusion`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request:**

```json
{
  "MODEL": "blood_pressure",
  "DATE": "2025-10-12",
  "TIME": "14:30:00",
  "HEALTH_DOCUMENT_ID": 1,
  "VALUE_SYS": 120,
  "VALUE_DIA": 80,
  "VALUE": 100,
  "INDICATOR": "Normal"
}
```

**Response:**

```json
{
  "data": {
    "ID": 1,
    "MODEL": "blood_pressure",
    "DATE": "2025-10-12",
    "TIME": "14:30:00",
    "VALUE_SYS": 120,
    "VALUE_DIA": 80,
    "VALUE": 100,
    "INDICATOR": "Normal"
  },
  "message": "Created successfully",
  "status": 200
}
```

## 2. Cập nhật conclusion

**PUT** `/api/conclusion/:id`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request:**

```json
{
  "VALUE_SYS": 130,
  "VALUE_DIA": 85,
  "INDICATOR": "Slightly High"
}
```

**Response:**

```json
{
  "data": {
    "ID": 1,
    "VALUE_SYS": 130,
    "VALUE_DIA": 85,
    "INDICATOR": "Slightly High"
  },
  "message": "Updated successfully",
  "status": 200
}
```

## 3. Lấy danh sách conclusion (phân trang)

**GET** `/api/conclusion/pagination`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Params:**

```
?OFFSET=0&LIMIT=10&MODEL=blood_pressure&START_TIME=2025-10-01&END_TIME=2025-10-31
```

**Response:**

```json
{
  "data": {
    "conclusions": [
      {
        "ID": 1,
        "MODEL": "blood_pressure",
        "DATE": "2025-10-12",
        "TIME": "14:30:00",
        "VALUE_SYS": 120,
        "VALUE_DIA": 80,
        "INDICATOR": "Normal"
      }
    ],
    "totalItems": 1,
    "totalPages": 1,
    "currentPage": 1
  },
  "message": "Retrieved successfully",
  "status": 200
}
```

## 4. Lấy danh sách conclusion (range)

**GET** `/api/conclusion/range`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Params:**

```
?MODEL=blood_pressure&START_TIME=2025-10-01&END_TIME=2025-10-31
```

**Response:**

```json
{
  "data": {
    "conclusions": [
      {
        "ID": 1,
        "MODEL": "blood_pressure",
        "DATE": "2025-10-12",
        "VALUE": 100,
        "INDICATOR": "Normal"
      }
    ],
    "count": 1
  },
  "message": "Retrieved successfully",
  "status": 200
}
```

Content-Type: application/json

````

**Body:**

```json
{
  "SYMPTOMS": "Đau đầu, chóng mặt, mệt mỏi",
  "DIAGNOSIS": "Thiếu máu não do stress và thiếu ngủ",
  "TREATMENT": "Nghỉ ngơi đầy đủ, uống nhiều nước, tập thể dục nhẹ",
  "MEDICATIONS": "Paracetamol 500mg khi cần, Vitamin B complex",
  "NOTES": "Tái khám sau 1 tuần nếu triệu chứng không giảm",
  "DOCTOR_NAME": "BS. Nguyễn Văn A",
  "CLINIC_NAME": "Phòng khám Sức khỏe Gia đình",
  "EXAMINATION_DATE": "2025-10-12",
  "NEXT_APPOINTMENT": "2025-10-19",
  "SEVERITY": "mild",
  "CATEGORY": "general"
}
````

**Validation Rules:**

- `SYMPTOMS`: Required, mô tả triệu chứng
- `DIAGNOSIS`: Required, chẩn đoán bệnh
- `TREATMENT`: Required, phương pháp điều trị
- `MEDICATIONS`: Optional, thuốc được kê đơn
- `NOTES`: Optional, ghi chú thêm
- `DOCTOR_NAME`: Optional, tên bác sĩ khám
- `CLINIC_NAME`: Optional, tên phòng khám/bệnh viện
- `EXAMINATION_DATE`: Required, ngày khám (YYYY-MM-DD)
- `NEXT_APPOINTMENT`: Optional, ngày tái khám
- `SEVERITY`: Optional, mức độ nghiêm trọng ["mild", "moderate", "severe"]
- `CATEGORY`: Optional, danh mục bệnh ["general", "cardiology", "neurology", "gastrology", "orthopedics"]

#### Response

**Success (200):**

```json
{
  "data": {
    "id": 1,
    "user_id": 1,
    "SYMPTOMS": "Đau đầu, chóng mặt, mệt mỏi",
    "DIAGNOSIS": "Thiếu máu não do stress và thiếu ngủ",
    "TREATMENT": "Nghỉ ngơi đầy đủ, uống nhiều nước, tập thể dục nhẹ",
    "MEDICATIONS": "Paracetamol 500mg khi cần, Vitamin B complex",
    "NOTES": "Tái khám sau 1 tuần nếu triệu chứng không giảm",
    "DOCTOR_NAME": "BS. Nguyễn Văn A",
    "CLINIC_NAME": "Phòng khám Sức khỏe Gia đình",
    "EXAMINATION_DATE": "2025-10-12T00:00:00Z",
    "NEXT_APPOINTMENT": "2025-10-19T00:00:00Z",
    "SEVERITY": "mild",
    "CATEGORY": "general",
    "STATUS": "active",
    "created_at": "2025-10-12T00:00:00Z",
    "updated_at": "2025-10-12T00:00:00Z"
  },
  "message": "Tạo kết luận khám bệnh thành công",
  "status": 200
}
```

---

### 2. Lấy Kết Luận Cá Nhân

**GET** `/api/conclusion/myself`

Lấy tất cả kết luận khám bệnh của user hiện tại.

#### Request

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

- `page` (number, optional): Số trang (default: 1)
- `limit` (number, optional): Số items per page (default: 10)
- `category` (string, optional): Lọc theo danh mục
- `severity` (string, optional): Lọc theo mức độ nghiêm trọng
- `from_date` (string, optional): Ngày bắt đầu (YYYY-MM-DD)
- `to_date` (string, optional): Ngày kết thúc (YYYY-MM-DD)
- `status` (string, optional): Lọc theo trạng thái ["active", "completed", "cancelled"]

#### Response

**Success (200):**

```json
{
  "data": {
    "items": [
      {
        "id": 1,
        "SYMPTOMS": "Đau đầu, chóng mặt, mệt mỏi",
        "DIAGNOSIS": "Thiếu máu não do stress và thiếu ngủ",
        "TREATMENT": "Nghỉ ngơi đầy đủ, uống nhiều nước",
        "DOCTOR_NAME": "BS. Nguyễn Văn A",
        "EXAMINATION_DATE": "2025-10-12T00:00:00Z",
        "SEVERITY": "mild",
        "CATEGORY": "general",
        "STATUS": "active",
        "created_at": "2025-10-12T00:00:00Z"
      },
      {
        "id": 2,
        "SYMPTOMS": "Đau bụng, buồn nôn",
        "DIAGNOSIS": "Viêm dạ dày cấp",
        "TREATMENT": "Ăn nhẹ, uống thuốc kháng acid",
        "DOCTOR_NAME": "BS. Trần Thị B",
        "EXAMINATION_DATE": "2025-10-10T00:00:00Z",
        "SEVERITY": "moderate",
        "CATEGORY": "gastrology",
        "STATUS": "completed",
        "created_at": "2025-10-10T00:00:00Z"
      }
    ],
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "summary": {
      "total_conclusions": 2,
      "active_treatments": 1,
      "completed_treatments": 1,
      "categories": {
        "general": 1,
        "gastrology": 1
      }
    }
  },
  "message": "Lấy kết luận cá nhân thành công",
  "status": 200
}
```

---

### 3. Lấy Kết Luận Theo ID

**GET** `/api/conclusion/:id`

Lấy chi tiết kết luận khám bệnh theo ID.

#### Request

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Parameters:**

- `id` (number): ID của kết luận

#### Response

**Success (200):**

```json
{
  "data": {
    "id": 1,
    "user_id": 1,
    "SYMPTOMS": "Đau đầu, chóng mặt, mệt mỏi",
    "DIAGNOSIS": "Thiếu máu não do stress và thiếu ngủ",
    "TREATMENT": "Nghỉ ngơi đầy đủ, uống nhiều nước, tập thể dục nhẹ",
    "MEDICATIONS": "Paracetamol 500mg khi cần, Vitamin B complex",
    "NOTES": "Tái khám sau 1 tuần nếu triệu chứng không giảm",
    "DOCTOR_NAME": "BS. Nguyễn Văn A",
    "CLINIC_NAME": "Phòng khám Sức khỏe Gia đình",
    "EXAMINATION_DATE": "2025-10-12T00:00:00Z",
    "NEXT_APPOINTMENT": "2025-10-19T00:00:00Z",
    "SEVERITY": "mild",
    "CATEGORY": "general",
    "STATUS": "active",
    "ATTACHMENTS": [
      {
        "id": 1,
        "filename": "xray_chest.jpg",
        "url": "uploads/conclusions/xray_chest_1.jpg",
        "type": "image"
      }
    ],
    "FOLLOW_UPS": [
      {
        "id": 1,
        "date": "2025-10-15T00:00:00Z",
        "notes": "Triệu chứng đã giảm 50%",
        "status": "improved"
      }
    ],
    "created_at": "2025-10-12T00:00:00Z",
    "updated_at": "2025-10-12T00:00:00Z",
    "user": {
      "user_id": 1,
      "FIRST_NAME": "John",
      "LAST_NAME": "Doe"
    }
  },
  "message": "Lấy chi tiết kết luận thành công",
  "status": 200
}
```

---

### 4. Cập Nhật Kết Luận

**PUT** `/api/conclusion/:id`

Cập nhật thông tin kết luận khám bệnh.

#### Request

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Parameters:**

- `id` (number): ID của kết luận

**Body:**

```json
{
  "TREATMENT": "Nghỉ ngơi đầy đủ, uống nhiều nước, tập yoga nhẹ",
  "MEDICATIONS": "Paracetamol 500mg khi cần, Vitamin B complex, Magnesium",
  "NOTES": "Triệu chứng đã cải thiện sau 3 ngày điều trị. Tiếp tục theo dõi",
  "STATUS": "improved",
  "NEXT_APPOINTMENT": "2025-10-26"
}
```

#### Response

**Success (200):**

```json
{
  "data": {
    "id": 1,
    "user_id": 1,
    "SYMPTOMS": "Đau đầu, chóng mặt, mệt mỏi",
    "DIAGNOSIS": "Thiếu máu não do stress và thiếu ngủ",
    "TREATMENT": "Nghỉ ngơi đầy đủ, uống nhiều nước, tập yoga nhẹ",
    "MEDICATIONS": "Paracetamol 500mg khi cần, Vitamin B complex, Magnesium",
    "NOTES": "Triệu chứng đã cải thiện sau 3 ngày điều trị. Tiếp tục theo dõi",
    "STATUS": "improved",
    "NEXT_APPOINTMENT": "2025-10-26T00:00:00Z",
    "updated_at": "2025-10-15T00:00:00Z"
  },
  "message": "Cập nhật kết luận thành công",
  "status": 200
}
```

---

### 5. Xóa Kết Luận

**DELETE** `/api/conclusion/:id`

Xóa kết luận khám bệnh (soft delete).

#### Request

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Parameters:**

- `id` (number): ID của kết luận

#### Response

**Success (200):**

```json
{
  "data": null,
  "message": "Xóa kết luận thành công",
  "status": 200
}
```

---

### 6. Thêm Theo Dõi

**POST** `/api/conclusion/:id/follow-up`

Thêm thông tin theo dõi cho kết luận khám bệnh.

#### Request

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Parameters:**

- `id` (number): ID của kết luận

**Body:**

```json
{
  "date": "2025-10-15",
  "notes": "Triệu chứng đã giảm 70%, cảm thấy tốt hơn nhiều",
  "status": "improved",
  "symptoms_rating": 3,
  "side_effects": "Không có tác dụng phụ",
  "medication_compliance": "good"
}
```

#### Response

**Success (200):**

```json
{
  "data": {
    "id": 1,
    "conclusion_id": 1,
    "date": "2025-10-15T00:00:00Z",
    "notes": "Triệu chứng đã giảm 70%, cảm thấy tốt hơn nhiều",
    "status": "improved",
    "symptoms_rating": 3,
    "side_effects": "Không có tác dụng phụ",
    "medication_compliance": "good",
    "created_at": "2025-10-15T00:00:00Z"
  },
  "message": "Thêm theo dõi thành công",
  "status": 200
}
```

---

### 7. Upload File Đính Kèm

**POST** `/api/conclusion/:id/attachment`

Upload file đính kèm cho kết luận (kết quả xét nghiệm, hình ảnh y tế).

#### Request

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Parameters:**

- `id` (number): ID của kết luận

**Body:**

- `file` (file): File đính kèm
- `description` (string): Mô tả file

#### Response

**Success (200):**

```json
{
  "data": {
    "id": 1,
    "conclusion_id": 1,
    "filename": "blood_test_result.pdf",
    "original_name": "Kết quả xét nghiệm máu.pdf",
    "url": "uploads/conclusions/blood_test_result_1.pdf",
    "type": "document",
    "size": 1024000,
    "description": "Kết quả xét nghiệm máu tổng quát",
    "uploaded_at": "2025-10-12T00:00:00Z"
  },
  "message": "Upload file thành công",
  "status": 200
}
```

---

### 8. Thống Kê Sức Khỏe

**GET** `/api/conclusion/statistics`

Lấy thống kê sức khỏe của user hiện tại.

#### Request

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

- `period` (string, optional): Khoảng thời gian ["week", "month", "quarter", "year"]
- `year` (number, optional): Năm cần thống kê

#### Response

**Success (200):**

```json
{
  "data": {
    "period": "month",
    "year": 2025,
    "month": 10,
    "summary": {
      "total_conclusions": 5,
      "active_treatments": 2,
      "completed_treatments": 3,
      "improvement_rate": 80
    },
    "by_category": {
      "general": 2,
      "cardiology": 1,
      "gastrology": 2
    },
    "by_severity": {
      "mild": 3,
      "moderate": 2,
      "severe": 0
    },
    "trends": {
      "this_month": 5,
      "last_month": 3,
      "change_percentage": 66.7
    },
    "upcoming_appointments": [
      {
        "id": 1,
        "date": "2025-10-19T00:00:00Z",
        "doctor": "BS. Nguyễn Văn A",
        "clinic": "Phòng khám Sức khỏe Gia đình"
      }
    ]
  },
  "message": "Lấy thống kê thành công",
  "status": 200
}
```

---

## Data Models

### Conclusion Entity

```typescript
interface Conclusion {
  id: number;
  user_id: number;
  SYMPTOMS: string;
  DIAGNOSIS: string;
  TREATMENT: string;
  MEDICATIONS?: string;
  NOTES?: string;
  DOCTOR_NAME?: string;
  CLINIC_NAME?: string;
  EXAMINATION_DATE: Date;
  NEXT_APPOINTMENT?: Date;
  SEVERITY?: 'mild' | 'moderate' | 'severe';
  CATEGORY?:
    | 'general'
    | 'cardiology'
    | 'neurology'
    | 'gastrology'
    | 'orthopedics';
  STATUS: 'active' | 'improved' | 'completed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;

  // Relations
  user?: User;
  followUps?: FollowUp[];
  attachments?: Attachment[];
}
```

### FollowUp Entity

```typescript
interface FollowUp {
  id: number;
  conclusion_id: number;
  date: Date;
  notes: string;
  status: 'worse' | 'same' | 'improved' | 'recovered';
  symptoms_rating: number; // 1-10 scale
  side_effects?: string;
  medication_compliance: 'poor' | 'fair' | 'good' | 'excellent';
  created_at: Date;
}
```

### Attachment Entity

```typescript
interface Attachment {
  id: number;
  conclusion_id: number;
  filename: string;
  original_name: string;
  url: string;
  type: 'image' | 'document' | 'video';
  size: number;
  mime_type: string;
  description?: string;
  uploaded_at: Date;
}
```

---

## Business Rules

### Data Validation

1. **EXAMINATION_DATE**: Không được vượt quá ngày hiện tại
2. **NEXT_APPOINTMENT**: Phải sau EXAMINATION_DATE
3. **SEVERITY**: Tự động gán dựa trên keywords trong SYMPTOMS/DIAGNOSIS
4. **STATUS**: Workflow: active → improved → completed

### Access Control

1. User chỉ có thể xem/sửa kết luận của chính mình
2. Admin có thể xem tất cả kết luận (ẩn danh)
3. Doctor role có thể tạo kết luận cho patients

### Data Retention

1. Soft delete - dữ liệu không bị xóa vĩnh viễn
2. Archive sau 5 năm
3. Backup hàng ngày cho dữ liệu y tế

---

## File Upload

### Supported File Types

- **Images**: jpg, jpeg, png, gif (max 10MB)
- **Documents**: pdf, doc, docx (max 20MB)
- **Video**: mp4, avi (max 100MB)

### Storage Structure

```
uploads/
  conclusions/
    {user_id}/
      {conclusion_id}/
        attachments/
          {filename}
```

### Security

- Virus scanning
- File type validation
- Size limits
- Access control via signed URLs

---

## Notifications

### Reminder System

```javascript
// Automatic reminders
const reminderTypes = {
  nextAppointment: {
    trigger: '1 day before',
    message: 'Bạn có lịch tái khám vào ngày mai',
  },
  medicationReminder: {
    trigger: 'daily at specified times',
    message: 'Đã đến giờ uống thuốc',
  },
  followUpReminder: {
    trigger: '1 week after treatment',
    message: 'Hãy cập nhật tình trạng sức khỏe',
  },
};
```

---

## Error Handling

### Common Errors

| Code | Message           | Description             |
| ---- | ----------------- | ----------------------- |
| 400  | Bad Request       | Dữ liệu không hợp lệ    |
| 401  | Unauthorized      | Chưa đăng nhập          |
| 403  | Forbidden         | Không có quyền truy cập |
| 404  | Not Found         | Kết luận không tồn tại  |
| 413  | Payload Too Large | File quá lớn            |

### Medical Data Validation

```json
{
  "statusCode": 400,
  "message": [
    "EXAMINATION_DATE không được vượt quá ngày hiện tại",
    "SEVERITY phải là một trong: mild, moderate, severe"
  ],
  "error": "Bad Request"
}
```

---

## Integration

### External Services

1. **OCR Service**: Đọc kết quả xét nghiệm từ hình ảnh
2. **Medical Database**: Tra cứu thông tin thuốc, bệnh
3. **Calendar Service**: Đồng bộ lịch tái khám
4. **Notification Service**: Gửi reminder

### Export Features

```javascript
// Export medical history
app.get('/api/conclusion/export/:format', async (req, res) => {
  const { format } = req.params; // pdf, excel, json
  const userId = req.user.user_id;

  const conclusions = await conclusionService.getUserConclusions(userId);
  const exportData = await exportService.generate(conclusions, format);

  res.setHeader(
    'Content-Disposition',
    `attachment; filename=medical_history.${format}`,
  );
  res.send(exportData);
});
```

---

## Testing

### Unit Tests

```javascript
describe('ConclusionController', () => {
  describe('createConclusion', () => {
    it('should create conclusion successfully', async () => {
      const conclusionData = {
        SYMPTOMS: 'Test symptoms',
        DIAGNOSIS: 'Test diagnosis',
        TREATMENT: 'Test treatment',
        EXAMINATION_DATE: '2025-10-12',
      };

      const result = await conclusionController.createNew(
        conclusionData,
        mockReq,
      );
      expect(result.status).toBe(200);
    });

    it('should validate examination date', async () => {
      const futureDate = {
        EXAMINATION_DATE: '2026-12-31',
      };

      await expect(
        conclusionController.createNew(futureDate, mockReq),
      ).rejects.toThrow('Ngày khám không được vượt quá ngày hiện tại');
    });
  });
});
```

### cURL Examples

**Create conclusion:**

```bash
curl -X POST http://localhost:3000/api/conclusion \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "SYMPTOMS": "Đau đầu, chóng mặt",
    "DIAGNOSIS": "Thiếu máu não",
    "TREATMENT": "Nghỉ ngơi, uống thuốc",
    "EXAMINATION_DATE": "2025-10-12"
  }'
```

**Get personal conclusions:**

```bash
curl -X GET "http://localhost:3000/api/conclusion/myself?page=1&limit=10" \
  -H "Authorization: Bearer your_jwt_token"
```

**Upload attachment:**

```bash
curl -X POST http://localhost:3000/api/conclusion/1/attachment \
  -H "Authorization: Bearer your_jwt_token" \
  -F "file=@blood_test.pdf" \
  -F "description=Kết quả xét nghiệm máu"
```

---

## Changelog

### v1.0.0 (2025-10-12)

- Initial conclusion management system
- Follow-up tracking
- File attachment support
- Medical statistics
- Reminder system
- Export functionality

---

_Cập nhật lần cuối: 12/10/2025_
