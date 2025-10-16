# Authentication API

## 1. Đăng nhập

**POST** `/api/auth/login`

**Request:**

```json
{
  "EMAIL": "user@example.com",
  "PASSWORD": "password123"
}
```

**Response:**

```json
{
  "data": {
    "user": { "userId": 1, "email": "user@example.com" },
    "accessToken": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  },
  "message": "Login successful",
  "status": 200
}
```

## 2. Đăng ký

**POST** `/api/auth/signup`

**Request:**

```json
{
  "EMAIL": "user@example.com",
  "PHONE": "0123456789",
  "PASSWORD": "password123"
}
```

**Response:**

```json
{
  "data": {
    "user": { "userId": 1, "email": "user@example.com" },
    "accessToken": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  },
  "message": "User created successfully",
  "status": 201
}
```

## 3. Refresh Token

**POST** `/api/auth/refresh`

**Headers:**

```
Authorization: Bearer <refresh_token>
```

**Response:**

```json
{
  "data": {
    "user": { "userId": 1, "email": "user@example.com" },
    "accessToken": "new_jwt_token_here",
    "refreshToken": "new_refresh_token_here"
  },
  "message": "Token refreshed successfully",
  "status": 200
}
```

      "user_id": 1,
      "EMAIL": "user@example.com",
      "FIRST_NAME": "John",
      "LAST_NAME": "Doe",
      "PHONE": "0123456789",
      "created_at": "2025-10-12T00:00:00Z",
      "updated_at": "2025-10-12T00:00:00Z"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

},
"message": "Đăng nhập thành công",
"status": 200
}

````

**Error (401):**

```json
{
  "statusCode": 401,
  "message": "Email hoặc mật khẩu không chính xác",
  "error": "Unauthorized"
}
````

#### cURL Example

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "EMAIL": "user@example.com",
    "PASSWORD": "password123"
  }'
```

---

### 2. Đăng ký

**POST** `/api/auth/signup`

Tạo tài khoản người dùng mới.

#### Request

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "EMAIL": "newuser@example.com",
  "PHONE": "0123456789",
  "PASSWORD": "password123",
  "FIRST_NAME": "John",
  "LAST_NAME": "Doe"
}
```

**Validation Rules:**

- `EMAIL`: Required, phải là email hợp lệ, chưa tồn tại trong hệ thống
- `PHONE`: Required, số điện thoại hợp lệ
- `PASSWORD`: Required, tối thiểu 6 ký tự
- `FIRST_NAME`: Required, tên
- `LAST_NAME`: Required, họ

#### Response

**Success (200):**

```json
{
  "data": {
    "user": {
      "user_id": 2,
      "EMAIL": "newuser@example.com",
      "FIRST_NAME": "John",
      "LAST_NAME": "Doe",
      "PHONE": "0123456789",
      "created_at": "2025-10-12T00:00:00Z",
      "updated_at": "2025-10-12T00:00:00Z"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Đăng ký thành công",
  "status": 200
}
```

**Error (400):**

```json
{
  "statusCode": 400,
  "message": [
    "EMAIL đã tồn tại trong hệ thống",
    "PASSWORD phải có ít nhất 6 ký tự"
  ],
  "error": "Bad Request"
}
```

#### cURL Example

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "EMAIL": "newuser@example.com",
    "PHONE": "0123456789",
    "PASSWORD": "password123",
    "FIRST_NAME": "John",
    "LAST_NAME": "Doe"
  }'
```

---

### 3. Lấy thông tin user hiện tại

**GET** `/api/auth/me`

Lấy thông tin của user đang đăng nhập.

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
    "user_id": 1,
    "EMAIL": "user@example.com",
    "FIRST_NAME": "John",
    "LAST_NAME": "Doe",
    "PHONE": "0123456789",
    "AVATAR": "path/to/avatar.jpg",
    "EMAIL_VERIFIED": true,
    "PHONE_VERIFIED": false,
    "created_at": "2025-10-12T00:00:00Z",
    "updated_at": "2025-10-12T00:00:00Z"
  },
  "message": "Lấy thông tin user thành công",
  "status": 200
}
```

**Error (401):**

```json
{
  "statusCode": 401,
  "message": "Token không hợp lệ",
  "error": "Unauthorized"
}
```

#### cURL Example

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer your_jwt_token_here"
```

---

## JWT Token

### Token Structure

JWT token được sử dụng để xác thực và chứa thông tin:

```json
{
  "user_id": 1,
  "email": "user@example.com",
  "iat": 1634567890,
  "exp": 1634654290
}
```

### Token Expiration

- **Access Token**: 24 giờ
- **Refresh Token**: 7 ngày (nếu có)

### How to use Token

Gửi token trong header của mỗi request cần xác thực:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Error Handling

### Common Error Codes

| Code | Message      | Description                     |
| ---- | ------------ | ------------------------------- |
| 400  | Bad Request  | Dữ liệu đầu vào không hợp lệ    |
| 401  | Unauthorized | Token không hợp lệ hoặc hết hạn |
| 403  | Forbidden    | Không có quyền truy cập         |
| 409  | Conflict     | Email đã tồn tại                |

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Email đã tồn tại trong hệ thống",
  "error": "Bad Request",
  "timestamp": "2025-10-12T00:00:00Z",
  "path": "/api/auth/signup"
}
```

---

## Security Notes

1. **Password Policy**:
   - Tối thiểu 6 ký tự
   - Nên có ít nhất 1 chữ hoa, 1 chữ thường, 1 số

2. **Rate Limiting**:
   - Login: 5 lần/phút
   - Signup: 3 lần/phút

3. **Token Security**:
   - JWT được ký bằng secret key
   - Token có thời hạn sử dụng
   - Không lưu trữ thông tin nhạy cảm trong token

---

## Testing

### Unit Tests

```javascript
describe('AuthController', () => {
  it('should login successfully with valid credentials', async () => {
    // Test case
  });

  it('should return 401 for invalid credentials', async () => {
    // Test case
  });
});
```

### Integration Tests

```javascript
describe('POST /auth/login', () => {
  it('should return access token for valid user', async () => {
    const response = await request(app).post('/api/auth/login').send({
      EMAIL: 'test@example.com',
      PASSWORD: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body.data.access_token).toBeDefined();
  });
});
```

---

## Changelog

### v1.0.0 (2025-10-12)

- Initial auth endpoints
- JWT implementation
- Email/password authentication

---

_Cập nhật lần cuối: 12/10/2025_
