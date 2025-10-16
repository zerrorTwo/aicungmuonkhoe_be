# User API

## 1. Lấy thông tin profile

**GET** `/api/user/profile`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "data": {
    "userId": 1,
    "fullName": "Nguyễn Văn A",
    "email": "user@example.com",
    "phone": "0123456789",
    "birthDate": "1990-01-01",
    "gender": "Nam",
    "address": "TP. Hồ Chí Minh",
    "avatar": "https://cloudinary.com/avatar.jpg"
  },
  "message": "Profile retrieved successfully",
  "status": 200
}
```

## 2. Cập nhật profile

**PUT** `/api/user/profile`

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json hoặc multipart/form-data
```

**Request:**

```json
{
  "FIRST_NAME": "Nguyễn",
  "LAST_NAME": "Văn A",
  "PHONE": "0123456789",
  "DOB": "1990-01-01",
  "ADDRESS": "TP. Hồ Chí Minh",
  "GENDER_ID": 1
}
```

**Response:**

```json
{
  "data": {
    "userId": 1,
    "fullName": "Nguyễn Văn A",
    "email": "user@example.com",
    "phone": "0123456789"
  },
  "message": "Profile updated successfully",
  "status": 200
}
```

## 3. Upload avatar

**POST** `/api/user/profile/avatar`

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request:**

```
Form data with file field "avatar"
```

**Response:**

```json
{
  "data": {
    "avatarUrl": "https://cloudinary.com/avatar.jpg"
  },
  "message": "Avatar uploaded successfully",
  "status": 200
}
```

```json
{
  "data": {
    "user_id": 1,
    "EMAIL": "user@example.com",
    "FIRST_NAME": "John",
    "LAST_NAME": "Doe",
    "PHONE": "0123456789",
    "FACE_ID": null,
    "created_at": "2025-10-12T00:00:00Z",
    "updated_at": "2025-10-12T00:00:00Z"
  },
  "message": "Tạo user thành công",
  "status": 200
}
```

---

### 2. Lấy User Theo ID

**GET** `/api/user/:id`

Lấy thông tin chi tiết của một user theo ID.

#### Request

**Parameters:**

- `id` (number): ID của user

#### Response

**Success (200):**

```json
{
  "data": {
    "user_id": 1,
    "EMAIL": "user@example.com",
    "FIRST_NAME": "John",
    "LAST_NAME": "Doe",
    "PHONE": "0123456789",
    "AVATAR": "uploads/avatars/avatar-1.jpg",
    "EMAIL_VERIFIED": true,
    "PHONE_VERIFIED": false,
    "created_at": "2025-10-12T00:00:00Z",
    "updated_at": "2025-10-12T00:00:00Z"
  },
  "message": "Lấy thông tin user thành công",
  "status": 200
}
```

**Error (404):**

```json
{
  "statusCode": 404,
  "message": "User không tồn tại",
  "error": "Not Found"
}
```

---

### 3. Lấy Profile User Hiện Tại

**GET** `/api/user/profile/me`

Lấy thông tin profile đầy đủ của user hiện tại, bao gồm cả health document.

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
    "user": {
      "user_id": 1,
      "EMAIL": "user@example.com",
      "FIRST_NAME": "John",
      "LAST_NAME": "Doe",
      "PHONE": "0123456789",
      "AVATAR": "uploads/avatars/avatar-1.jpg",
      "EMAIL_VERIFIED": true,
      "PHONE_VERIFIED": false,
      "created_at": "2025-10-12T00:00:00Z",
      "updated_at": "2025-10-12T00:00:00Z"
    },
    "healthDocument": {
      "id": 1,
      "HEIGHT": 170,
      "WEIGHT": 65,
      "BLOOD_GROUP": "A+",
      "BMI": 22.5,
      "ALLERGIES": "Không có",
      "MEDICAL_HISTORY": "Tiền sử bệnh tim",
      "CURRENT_MEDICATIONS": "Thuốc huyết áp",
      "created_at": "2025-10-12T00:00:00Z",
      "updated_at": "2025-10-12T00:00:00Z"
    }
  },
  "message": "Lấy profile thành công",
  "status": 200
}
```

**Error (401):**

```json
{
  "statusCode": 401,
  "message": "User không được xác thực",
  "error": "Unauthorized"
}
```

---

### 4. Cập Nhật Profile

**PUT** `/api/user/profile`

Cập nhật thông tin profile của user hiện tại.

#### Request

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**

```json
{
  "FIRST_NAME": "John Updated",
  "LAST_NAME": "Doe Updated",
  "PHONE": "0987654321"
}
```

**Validation Rules:**

- `FIRST_NAME`: Optional, tên người dùng
- `LAST_NAME`: Optional, họ người dùng
- `PHONE`: Optional, số điện thoại hợp lệ

#### Response

**Success (200):**

```json
{
  "data": {
    "user_id": 1,
    "EMAIL": "user@example.com",
    "FIRST_NAME": "John Updated",
    "LAST_NAME": "Doe Updated",
    "PHONE": "0987654321",
    "updated_at": "2025-10-12T00:00:00Z"
  },
  "message": "Cập nhật profile thành công",
  "status": 200
}
```

---

### 5. Cập Nhật Avatar

**PUT** `/api/user/avatar`

Cập nhật ảnh đại diện của user.

#### Request

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Body:**

- `avatar` (file): File ảnh avatar (jpg, jpeg, png)

**File Constraints:**

- Kích thước tối đa: 5MB
- Định dạng: jpg, jpeg, png
- Kích thước khuyến nghị: 200x200px

#### Response

**Success (200):**

```json
{
  "data": {
    "user_id": 1,
    "AVATAR": "uploads/avatars/avatar-1-updated.jpg",
    "updated_at": "2025-10-12T00:00:00Z"
  },
  "message": "Cập nhật avatar thành công",
  "status": 200
}
```

**Error (400):**

```json
{
  "statusCode": 400,
  "message": "File không hợp lệ. Chỉ chấp nhận jpg, jpeg, png",
  "error": "Bad Request"
}
```

#### cURL Example

```bash
curl -X PUT http://localhost:3000/api/user/avatar \
  -H "Authorization: Bearer your_jwt_token" \
  -F "avatar=@/path/to/avatar.jpg"
```

---

### 6. Cập Nhật Cài Đặt Bảo Mật

**PUT** `/api/user/security`

Cập nhật cài đặt bảo mật như thay đổi mật khẩu.

#### Request

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**

```json
{
  "OLD_PASSWORD": "oldpassword123",
  "NEW_PASSWORD": "newpassword123"
}
```

**Validation Rules:**

- `OLD_PASSWORD`: Required, mật khẩu hiện tại
- `NEW_PASSWORD`: Required, mật khẩu mới (tối thiểu 6 ký tự)

#### Response

**Success (200):**

```json
{
  "data": null,
  "message": "Cập nhật mật khẩu thành công",
  "status": 200
}
```

**Error (400):**

```json
{
  "statusCode": 400,
  "message": "Mật khẩu hiện tại không chính xác",
  "error": "Bad Request"
}
```

---

### 7. Lấy Danh Sách Users (Admin)

**GET** `/api/user`

Lấy danh sách tất cả users (dành cho admin).

#### Request

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
```

**Query Parameters:**

- `page` (number, optional): Số trang (default: 1)
- `limit` (number, optional): Số items per page (default: 10)
- `search` (string, optional): Từ khóa tìm kiếm (tìm theo email, tên)
- `sort` (string, optional): Sắp xếp (created_at, email, name)
- `order` (string, optional): Thứ tự (asc, desc)

#### Response

**Success (200):**

```json
{
  "data": {
    "items": [
      {
        "user_id": 1,
        "EMAIL": "user1@example.com",
        "FIRST_NAME": "John",
        "LAST_NAME": "Doe",
        "created_at": "2025-10-12T00:00:00Z"
      },
      {
        "user_id": 2,
        "EMAIL": "user2@example.com",
        "FIRST_NAME": "Jane",
        "LAST_NAME": "Smith",
        "created_at": "2025-10-12T00:00:00Z"
      }
    ],
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  },
  "message": "Lấy danh sách users thành công",
  "status": 200
}
```

---

### 8. Xóa User (Admin)

**DELETE** `/api/user/:id`

Xóa user theo ID (dành cho admin).

#### Request

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
```

**Parameters:**

- `id` (number): ID của user cần xóa

#### Response

**Success (200):**

```json
{
  "data": null,
  "message": "Xóa user thành công",
  "status": 200
}
```

**Error (404):**

```json
{
  "statusCode": 404,
  "message": "User không tồn tại",
  "error": "Not Found"
}
```

---

## Data Models

### User Entity

```typescript
interface User {
  user_id: number;
  EMAIL: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  PHONE: string;
  PASSWORD?: string; // Không trả về trong response
  AVATAR?: string;
  FACE_ID?: string;
  EMAIL_VERIFIED: boolean;
  PHONE_VERIFIED: boolean;
  ROLE: 'USER' | 'ADMIN';
  created_at: Date;
  updated_at: Date;
}
```

### Profile Response

```typescript
interface ProfileResponse {
  user: User;
  healthDocument?: HealthDocument;
}
```

---

## File Upload

### Avatar Upload

- **Endpoint**: `PUT /api/user/avatar`
- **Field name**: `avatar`
- **Max size**: 5MB
- **Allowed types**: jpg, jpeg, png
- **Storage**: Local filesystem (`uploads/avatars/`)

### File Naming Convention

```
avatar-{user_id}-{timestamp}.{extension}
```

Example: `avatar-1-1634567890.jpg`

---

## Error Handling

### Common Errors

| Code | Message           | Description             |
| ---- | ----------------- | ----------------------- |
| 400  | Bad Request       | Dữ liệu không hợp lệ    |
| 401  | Unauthorized      | Không có quyền truy cập |
| 404  | Not Found         | User không tồn tại      |
| 409  | Conflict          | Email đã tồn tại        |
| 413  | Payload Too Large | File quá lớn            |

### Validation Errors

```json
{
  "statusCode": 400,
  "message": [
    "EMAIL phải là email hợp lệ",
    "PHONE phải là số điện thoại hợp lệ"
  ],
  "error": "Bad Request"
}
```

---

## Security & Permissions

### Authentication Required

Tất cả endpoints trừ `POST /user` đều yêu cầu JWT token.

### Role-based Access

- **USER**: Chỉ có thể truy cập và sửa thông tin của chính mình
- **ADMIN**: Có thể truy cập tất cả users và thực hiện các thao tác admin

### Data Privacy

- Mật khẩu không bao giờ được trả về trong response
- Thông tin nhạy cảm chỉ trả về cho chính user đó hoặc admin

---

## Testing

### Unit Tests

```javascript
describe('UserController', () => {
  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      // Test implementation
    });

    it('should validate phone number format', async () => {
      // Test implementation
    });
  });
});
```

### cURL Examples

**Get user profile:**

```bash
curl -X GET http://localhost:3000/api/user/profile/me \
  -H "Authorization: Bearer your_jwt_token"
```

**Update profile:**

```bash
curl -X PUT http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "FIRST_NAME": "Updated Name",
    "PHONE": "0987654321"
  }'
```

---

## Changelog

### v1.0.0 (2025-10-12)

- Initial user management endpoints
- Profile management
- Avatar upload
- Security settings

---

_Cập nhật lần cuối: 12/10/2025_
