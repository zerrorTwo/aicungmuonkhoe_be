# CORS Configuration

Cấu hình CORS (Cross-Origin Resource Sharing) cho ứng dụng backend.

## Files

- `cors.config.ts` - Cấu hình CORS chính
- `cors.utils.ts` - Utilities và helper functions cho CORS
- `main.ts` - Import và sử dụng CORS config

## Cấu hình

### Development

Trong môi trường development, CORS cho phép:

- Tất cả các localhost origins (port bất kỳ)
- Các 127.0.0.1 origins
- Requests không có origin (mobile apps, Postman, etc.)

### Production

Trong production, CORS chỉ cho phép:

- Origins được định nghĩa trong `ALLOWED_ORIGINS` environment variable
- Hoặc default production domains nếu không có env var

## Environment Variables

### ALLOWED_ORIGINS

Comma-separated list of allowed origins cho production:

```env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,https://app.yourdomain.com
```

### NODE_ENV

Xác định môi trường:

```env
NODE_ENV=production  # hoặc development
```

## Tính năng

### Credentials Support

- `credentials: true` - Bắt buộc cho cookies (refresh token)
- Cho phép browser gửi cookies và authorization headers

### Allowed Methods

- GET, POST, PUT, DELETE, PATCH, OPTIONS

### Allowed Headers

- Origin, X-Requested-With, Content-Type, Accept
- Authorization (cho JWT tokens)
- Cache-Control, X-CSRF-Token

### Preflight Cache

- `maxAge: 86400` (24 hours) - Cache preflight requests

## Security

### Development

- Relaxed CORS cho localhost development
- Logging chi tiết cho debugging

### Production

- Strict origin checking
- Environment variable configuration
- Warning logs cho blocked origins

## Debugging

CORS config sẽ log thông tin khi startup:

```
[CORS] CORS Configuration:
[CORS] Allowed Origins: http://localhost:3000, http://localhost:5173, ...
[CORS] Credentials: Enabled (for cookies)
[CORS] Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
```

Khi origin bị block:

```
CORS: Origin 'https://malicious-site.com' not allowed
```

## Troubleshooting

### CORS Error trong browser

1. Kiểm tra origin trong developer tools
2. Đảm bảo origin được include trong allowed origins
3. Kiểm tra `credentials: true` nếu sử dụng cookies
4. Verify HTTP vs HTTPS matching

### Cookies không được gửi

1. Đảm bảo `credentials: true` trong CORS
2. Frontend phải set `credentials: 'include'` trong fetch
3. Check SameSite và Secure cookie attributes

### Development CORS issues

1. Restart backend sau khi thay đổi CORS config
2. Clear browser cache
3. Check console logs cho CORS errors
4. Verify frontend API URL trong .env

## Examples

### Frontend fetch with credentials:

```javascript
fetch('http://localhost:5000/v1/api/auth/login', {
  method: 'POST',
  credentials: 'include', // Important!
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
});
```

### Axios with credentials:

```javascript
axios.defaults.withCredentials = true;
// hoặc
axios.post('/auth/login', data, {
  withCredentials: true,
});
```
