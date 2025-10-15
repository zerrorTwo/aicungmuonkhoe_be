# Mail API

## 1. Gửi mã xác thực

**POST** `/api/mail/send-verification`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request:**

```json
{
  "EMAIL": "user@example.com"
}
```

hoặc

```json
{
  "PHONE": "0123456789"
}
```

**Response:**

```json
{
  "data": "Send code successfully!!",
  "message": "Verification code sent",
  "status": 200
}
```

## 2. Xác thực email

**POST** `/api/mail/verify-email`

**Request:**

```json
{
  "EMAIL": "user@example.com",
  "CODE": "123456"
}
```

**Response:**

```json
{
  "data": {
    "success": true,
    "message": "Email verified successfully"
  },
  "message": "Email verification successful",
  "status": 200
}
```

## 3. Kiểm tra kết nối email

**GET** `/api/mail/test`

**Response:**

```json
{
  "data": {
    "connectionStatus": true,
    "message": "Email service is working properly"
  },
  "message": "Email connection tested",
  "status": 200
}
```

```json
{
  "type": "email",
  "recipient": "user@example.com"
}
```

**Validation Rules:**

- `type`: Required, một trong ["email", "sms"]
- `recipient`: Required, email hoặc số điện thoại tùy theo type

#### Response

**Success (200):**

```json
{
  "data": null,
  "message": "Mã xác thực đã được gửi đến user@example.com",
  "status": 200
}
```

**Error (400):**

```json
{
  "statusCode": 400,
  "message": "Email không hợp lệ",
  "error": "Bad Request"
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

#### cURL Example

```bash
curl -X POST http://localhost:3000/api/mail/send-verification \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "email",
    "recipient": "user@example.com"
  }'
```

---

### 2. Xác Thực Email

**POST** `/api/mail/verify-email`

Xác thực email bằng mã OTP đã được gửi.

#### Request

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Validation Rules:**

- `email`: Required, email hợp lệ
- `otp`: Required, mã OTP 6 chữ số

#### Response

**Success (200):**

```json
{
  "data": {
    "verified": true,
    "email": "user@example.com",
    "verified_at": "2025-10-12T00:00:00Z"
  },
  "message": "Xác thực email thành công",
  "status": 200
}
```

**Error (400):**

```json
{
  "statusCode": 400,
  "message": "Mã OTP không chính xác hoặc đã hết hạn",
  "error": "Bad Request"
}
```

**Error (404):**

```json
{
  "statusCode": 404,
  "message": "Email không tồn tại trong hệ thống",
  "error": "Not Found"
}
```

#### cURL Example

```bash
curl -X POST http://localhost:3000/api/mail/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "123456"
  }'
```

---

### 3. Xác Thực Số Điện Thoại

**POST** `/api/mail/verify-phone`

Xác thực số điện thoại bằng mã OTP đã được gửi qua SMS.

#### Request

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "phone": "0123456789",
  "otp": "654321"
}
```

**Validation Rules:**

- `phone`: Required, số điện thoại hợp lệ
- `otp`: Required, mã OTP 6 chữ số

#### Response

**Success (200):**

```json
{
  "data": {
    "verified": true,
    "phone": "0123456789",
    "verified_at": "2025-10-12T00:00:00Z"
  },
  "message": "Xác thực số điện thoại thành công",
  "status": 200
}
```

---

### 4. Gửi Email Quên Mật Khẩu

**POST** `/api/mail/forgot-password`

Gửi email chứa link reset mật khẩu.

#### Request

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "email": "user@example.com"
}
```

#### Response

**Success (200):**

```json
{
  "data": null,
  "message": "Email reset mật khẩu đã được gửi",
  "status": 200
}
```

---

### 5. Gửi Email Thông Báo

**POST** `/api/mail/send-notification`

Gửi email thông báo đến user (dành cho admin hoặc system).

#### Request

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Body:**

```json
{
  "recipient": "user@example.com",
  "subject": "Thông báo quan trọng",
  "template": "notification",
  "data": {
    "user_name": "John Doe",
    "message": "Hồ sơ sức khỏe của bạn đã được cập nhật",
    "action_url": "https://app.example.com/health-document"
  }
}
```

#### Response

**Success (200):**

```json
{
  "data": {
    "message_id": "msg_123456789",
    "sent_at": "2025-10-12T00:00:00Z"
  },
  "message": "Email thông báo đã được gửi",
  "status": 200
}
```

---

### 6. Lấy Lịch Sử Email

**GET** `/api/mail/history`

Lấy lịch sử gửi email của user hiện tại.

#### Request

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

- `page` (number, optional): Số trang (default: 1)
- `limit` (number, optional): Số items per page (default: 10)
- `type` (string, optional): Loại email ["verification", "notification", "reset_password"]
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
        "type": "verification",
        "recipient": "user@example.com",
        "subject": "Xác thực tài khoản",
        "status": "sent",
        "sent_at": "2025-10-12T00:00:00Z"
      },
      {
        "id": 2,
        "type": "notification",
        "recipient": "user@example.com",
        "subject": "Thông báo cập nhật",
        "status": "delivered",
        "sent_at": "2025-10-11T00:00:00Z"
      }
    ],
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "message": "Lấy lịch sử email thành công",
  "status": 200
}
```

---

## Data Models

### VerificationCode Entity

```typescript
interface VerificationCode {
  id: number;
  user_id: number;
  type: 'email' | 'sms';
  recipient: string;
  code: string; // Encrypted
  expires_at: Date;
  used: boolean;
  used_at?: Date;
  created_at: Date;
}
```

### EmailLog Entity

```typescript
interface EmailLog {
  id: number;
  user_id?: number;
  type: 'verification' | 'notification' | 'reset_password' | 'marketing';
  recipient: string;
  subject: string;
  template: string;
  data?: object;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
  message_id?: string;
  error_message?: string;
  sent_at?: Date;
  delivered_at?: Date;
  created_at: Date;
}
```

---

## Email Templates

### 1. Verification Email Template

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Xác thực tài khoản</title>
  </head>
  <body>
    <div
      style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"
    >
      <h2>Xác thực tài khoản AI Cùng Muốn Khỏe</h2>
      <p>Xin chào {{user_name}},</p>
      <p>Mã xác thực của bạn là:</p>
      <div
        style="font-size: 24px; font-weight: bold; color: #007bff; text-align: center; padding: 20px; background: #f8f9fa; border-radius: 5px;"
      >
        {{otp_code}}
      </div>
      <p>Mã này sẽ hết hạn sau 15 phút.</p>
      <p>Nếu bạn không yêu cầu xác thực này, vui lòng bỏ qua email này.</p>
      <hr />
      <p style="color: #666;">Trân trọng,<br />Đội ngũ AI Cùng Muốn Khỏe</p>
    </div>
  </body>
</html>
```

### 2. Password Reset Template

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Reset mật khẩu</title>
  </head>
  <body>
    <div
      style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"
    >
      <h2>Reset mật khẩu tài khoản</h2>
      <p>Xin chào {{user_name}},</p>
      <p>
        Bạn đã yêu cầu reset mật khẩu. Nhấn vào nút bên dưới để tạo mật khẩu
        mới:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a
          href="{{reset_url}}"
          style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;"
        >
          Reset Mật Khẩu
        </a>
      </div>
      <p>Link này sẽ hết hạn sau 1 giờ.</p>
      <p>Nếu bạn không yêu cầu reset mật khẩu, vui lòng bỏ qua email này.</p>
      <hr />
      <p style="color: #666;">Trân trọng,<br />Đội ngũ AI Cùng Muốn Khỏe</p>
    </div>
  </body>
</html>
```

### 3. Notification Template

```html
<!DOCTYPE html>
<html>
  <head>
    <title>{{subject}}</title>
  </head>
  <body>
    <div
      style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"
    >
      <h2>{{subject}}</h2>
      <p>Xin chào {{user_name}},</p>
      <p>{{message}}</p>
      {{#if action_url}}
      <div style="text-align: center; margin: 30px 0;">
        <a
          href="{{action_url}}"
          style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;"
        >
          Xem Chi Tiết
        </a>
      </div>
      {{/if}}
      <hr />
      <p style="color: #666;">Trân trọng,<br />Đội ngũ AI Cùng Muốn Khỏe</p>
    </div>
  </body>
</html>
```

---

## Configuration

### SMTP Settings

```yaml
# config/mail.yaml
smtp:
  host: smtp.gmail.com
  port: 587
  secure: false
  auth:
    user: ${SMTP_USER}
    pass: ${SMTP_PASS}

default_from:
  name: 'AI Cùng Muốn Khỏe'
  email: 'noreply@aicungmuonkhoe.com'

templates:
  verification: 'templates/verification.hbs'
  reset_password: 'templates/reset-password.hbs'
  notification: 'templates/notification.hbs'

otp:
  length: 6
  expiry_minutes: 15
  max_attempts: 3
```

### SMS Settings (Twilio)

```yaml
# config/sms.yaml
twilio:
  account_sid: ${TWILIO_ACCOUNT_SID}
  auth_token: ${TWILIO_AUTH_TOKEN}
  phone_number: ${TWILIO_PHONE_NUMBER}

templates:
  verification: 'Mã xác thực AI Cùng Muốn Khỏe: {{otp_code}}. Mã có hiệu lực 15 phút.'
```

---

## Rate Limiting

### Email Rate Limits

- **Verification emails**: 3 emails/5 phút per user
- **Password reset**: 2 emails/giờ per user
- **Notifications**: 10 emails/ngày per user

### SMS Rate Limits

- **Verification SMS**: 2 SMS/5 phút per phone number
- **Daily limit**: 5 SMS/ngày per phone number

---

## Error Handling

### Common Errors

| Code | Message               | Description          |
| ---- | --------------------- | -------------------- |
| 400  | Bad Request           | Dữ liệu không hợp lệ |
| 401  | Unauthorized          | Chưa xác thực        |
| 429  | Too Many Requests     | Vượt quá rate limit  |
| 500  | Internal Server Error | Lỗi gửi email/SMS    |

### Rate Limit Error

```json
{
  "statusCode": 429,
  "message": "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 5 phút.",
  "error": "Too Many Requests",
  "retry_after": 300
}
```

### SMTP Error

```json
{
  "statusCode": 500,
  "message": "Không thể gửi email. Vui lòng thử lại sau.",
  "error": "Internal Server Error",
  "details": "SMTP connection failed"
}
```

---

## Security

### OTP Security

1. **Random Generation**: Sử dụng crypto.randomBytes()
2. **Encryption**: OTP được hash trước khi lưu DB
3. **Expiry**: Tự động hết hạn sau 15 phút
4. **Single Use**: Mỗi OTP chỉ sử dụng được 1 lần
5. **Rate Limiting**: Giới hạn số lần gửi

### Email Security

1. **SPF/DKIM**: Cấu hình để tránh spam
2. **TLS**: Mã hóa kết nối SMTP
3. **No Reply**: Sử dụng địa chỉ noreply
4. **Bounce Handling**: Xử lý email bounce back

---

## Monitoring & Logging

### Email Delivery Tracking

```javascript
// Example webhook from email provider
{
  "event": "delivered",
  "message_id": "msg_123456789",
  "recipient": "user@example.com",
  "timestamp": "2025-10-12T00:00:00Z",
  "reason": null
}
```

### Metrics to Track

- Email delivery rate
- SMS delivery rate
- OTP verification success rate
- Bounce rate
- Spam complaints

---

## Testing

### Unit Tests

```javascript
describe('MailController', () => {
  describe('sendVerification', () => {
    it('should send OTP email successfully', async () => {
      // Test implementation
    });

    it('should respect rate limits', async () => {
      // Test rate limiting
    });

    it('should generate secure OTP', async () => {
      // Test OTP generation
    });
  });
});
```

### cURL Examples

**Send verification email:**

```bash
curl -X POST http://localhost:3000/api/mail/send-verification \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "email",
    "recipient": "user@example.com"
  }'
```

**Verify email with OTP:**

```bash
curl -X POST http://localhost:3000/api/mail/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "123456"
  }'
```

---

## Integration

### Third-party Services

1. **SMTP Provider**: Gmail, SendGrid, AWS SES
2. **SMS Provider**: Twilio, AWS SNS
3. **Template Engine**: Handlebars
4. **Queue System**: Bull/Redis cho async processing

### Webhook Integration

```javascript
// Email status webhook endpoint
app.post('/webhooks/email-status', (req, res) => {
  const { message_id, status, reason } = req.body;

  // Update email log status
  await emailLogService.updateStatus(message_id, status, reason);

  res.status(200).send('OK');
});
```

---

## Changelog

### v1.0.0 (2025-10-12)

- Initial mail service implementation
- OTP verification for email/SMS
- Password reset functionality
- Email templates system
- Rate limiting implementation

---

_Cập nhật lần cuối: 12/10/2025_
