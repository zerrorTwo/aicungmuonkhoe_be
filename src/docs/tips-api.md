# Tips API

## 1. Lấy danh sách tips

**GET** `/api/tips`

**Response:**

```json
{
  "data": [
    {
      "ID": 1,
      "TITLE": "Bí quyết giữ sức khỏe",
      "CONTENT": "Uống đủ nước mỗi ngày, tập thể dục đều đặn...",
      "CATEGORY": "health",
      "IS_ACTIVE": true,
      "CREATED_AT": "2025-10-12T10:00:00Z"
    }
  ],
  "message": "Tips retrieved successfully",
  "status": 200
}
```

## 2. Lấy tips theo ID

**GET** `/api/tips/:id`

**Response:**

```json
{
  "data": {
    "ID": 1,
    "TITLE": "Bí quyết giữ sức khỏe",
    "CONTENT": "Uống đủ nước mỗi ngày, tập thể dục đều đặn, ăn uống lành mạnh và ngủ đủ giấc.",
    "CATEGORY": "health",
    "IS_ACTIVE": true,
    "CREATED_AT": "2025-10-12T10:00:00Z"
  },
  "message": "Tip retrieved successfully",
  "status": 200
}
```

## 3. Lấy tips theo category

**GET** `/api/tips/category/:category`

**Response:**

```json
{
  "data": [
    {
      "ID": 1,
      "TITLE": "Bí quyết giữ sức khỏe",
      "CONTENT": "Uống đủ nước mỗi ngày...",
      "CATEGORY": "health",
      "IS_ACTIVE": true
    }
  ],
  "message": "Tips by category retrieved successfully",
  "status": 200
}
```

**Body:** (Optional)

```json
{
  "category": "nutrition",
  "limit": 10
}
```

#### Response

**Success (200):**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Uống đủ nước mỗi ngày",
      "content": "Hãy duy trì thói quen uống đủ nước mỗi ngày, khoảng 2-3 lít, vì nước không chỉ giúp cơ thể loại bỏ độc tố mà còn giữ cho làn da tươi trẻ, tinh thần tỉnh táo và các cơ quan hoạt động nhịp nhàng.",
      "category": "nutrition",
      "priority": 1,
      "image_url": "uploads/tips/tip-1.jpg",
      "tags": ["nước", "dinh dưỡng", "detox"],
      "author": "Dr. Nguyễn Văn A",
      "created_at": "2025-10-12T00:00:00Z",
      "updated_at": "2025-10-12T00:00:00Z"
    },
    {
      "id": 2,
      "title": "Tập thể dục đều đặn",
      "content": "Tập thể dục 30 phút mỗi ngày giúp tăng cường hệ miễn dịch, cải thiện sức khỏe tim mạch và giảm nguy cơ mắc các bệnh mãn tính như tiểu đường, cao huyết áp.",
      "category": "exercise",
      "priority": 2,
      "image_url": "uploads/tips/tip-2.jpg",
      "tags": ["tập luyện", "tim mạch", "miễn dịch"],
      "author": "PT. Trần Thị B",
      "created_at": "2025-10-12T00:00:00Z",
      "updated_at": "2025-10-12T00:00:00Z"
    },
    {
      "id": 3,
      "title": "Ăn đa dạng màu sắc",
      "content": "Ăn đa dạng 5 màu sắc trái cây và rau củ mỗi ngày để cung cấp đầy đủ vitamin, khoáng chất và chất chống oxy hóa cho cơ thể.",
      "category": "nutrition",
      "priority": 3,
      "image_url": "uploads/tips/tip-3.jpg",
      "tags": ["rau củ", "vitamin", "chống oxy hóa"],
      "author": "Nutritionist Lê Văn C",
      "created_at": "2025-10-12T00:00:00Z",
      "updated_at": "2025-10-12T00:00:00Z"
    },
    {
      "id": 4,
      "title": "Ngủ đủ giấc",
      "content": "Ngủ đủ 7-8 tiếng mỗi đêm giúp cơ thể phục hồi, tăng cường trí nhớ và duy trì cân nặng khỏe mạnh. Thiết lập thói quen ngủ đều đặn.",
      "category": "sleep",
      "priority": 4,
      "image_url": "uploads/tips/tip-4.jpg",
      "tags": ["ngủ", "phục hồi", "trí nhớ"],
      "author": "Dr. Phạm Thị D",
      "created_at": "2025-10-12T00:00:00Z",
      "updated_at": "2025-10-12T00:00:00Z"
    }
  ],
  "message": "Lấy tips thành công",
  "status": 200
}
```

#### cURL Example

```bash
curl -X POST http://localhost:3000/api/tips \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

### 2. Lấy Tips Theo Danh Mục

**GET** `/api/tips/category/:category`

Lấy danh sách tips theo danh mục cụ thể.

#### Request

**Parameters:**

- `category` (string): Danh mục tips ["nutrition", "exercise", "sleep", "mental_health", "general"]

**Query Parameters:**

- `page` (number, optional): Số trang (default: 1)
- `limit` (number, optional): Số items per page (default: 10)

#### Response

**Success (200):**

```json
{
  "data": {
    "items": [
      {
        "id": 1,
        "title": "Uống đủ nước mỗi ngày",
        "content": "Hãy duy trì thói quen uống đủ nước...",
        "category": "nutrition",
        "priority": 1,
        "image_url": "uploads/tips/tip-1.jpg",
        "tags": ["nước", "dinh dưỡng"],
        "created_at": "2025-10-12T00:00:00Z"
      }
    ],
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "message": "Lấy tips theo danh mục thành công",
  "status": 200
}
```

---

### 3. Lấy Tip Chi Tiết

**GET** `/api/tips/:id`

Lấy thông tin chi tiết của một tip cụ thể.

#### Request

**Parameters:**

- `id` (number): ID của tip

#### Response

**Success (200):**

```json
{
  "data": {
    "id": 1,
    "title": "Uống đủ nước mỗi ngày",
    "content": "Hãy duy trì thói quen uống đủ nước mỗi ngày, khoảng 2-3 lít, vì nước không chỉ giúp cơ thể loại bỏ độc tố mà còn giữ cho làn da tươi trẻ, tinh thần tỉnh táo và các cơ quan hoạt động nhịp nhàng.",
    "detailed_content": "Nước đóng vai trò quan trọng trong việc duy trì các chức năng cơ bản của cơ thể...",
    "category": "nutrition",
    "priority": 1,
    "image_url": "uploads/tips/tip-1.jpg",
    "tags": ["nước", "dinh dưỡng", "detox"],
    "author": "Dr. Nguyễn Văn A",
    "author_bio": "Bác sĩ dinh dưỡng với 10 năm kinh nghiệm",
    "references": [
      "WHO Guidelines on Water Intake",
      "American Journal of Nutrition 2020"
    ],
    "related_tips": [2, 3],
    "views": 1250,
    "likes": 89,
    "created_at": "2025-10-12T00:00:00Z",
    "updated_at": "2025-10-12T00:00:00Z"
  },
  "message": "Lấy chi tiết tip thành công",
  "status": 200
}
```

---

### 4. Lấy Tips Ngẫu Nhiên

**GET** `/api/tips/random`

Lấy một tip ngẫu nhiên để hiển thị (tip of the day).

#### Request

**Query Parameters:**

- `category` (string, optional): Lọc theo danh mục
- `exclude` (array, optional): Loại trừ các tip IDs đã xem

#### Response

**Success (200):**

```json
{
  "data": {
    "id": 3,
    "title": "Ăn đa dạng màu sắc",
    "content": "Ăn đa dạng 5 màu sắc trái cây và rau củ...",
    "category": "nutrition",
    "image_url": "uploads/tips/tip-3.jpg",
    "author": "Nutritionist Lê Văn C",
    "created_at": "2025-10-12T00:00:00Z"
  },
  "message": "Lấy tip ngẫu nhiên thành công",
  "status": 200
}
```

---

### 5. Tìm Kiếm Tips

**GET** `/api/tips/search`

Tìm kiếm tips theo từ khóa.

#### Request

**Query Parameters:**

- `q` (string): Từ khóa tìm kiếm
- `category` (string, optional): Lọc theo danh mục
- `page` (number, optional): Số trang
- `limit` (number, optional): Số items per page

#### Response

**Success (200):**

```json
{
  "data": {
    "items": [
      {
        "id": 1,
        "title": "Uống đủ nước mỗi ngày",
        "content": "Hãy duy trì thói quen uống đủ nước...",
        "category": "nutrition",
        "relevance_score": 0.95,
        "highlighted": {
          "title": "Uống đủ <mark>nước</mark> mỗi ngày",
          "content": "...duy trì thói quen uống đủ <mark>nước</mark>..."
        }
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "query": "nước"
  },
  "message": "Tìm kiếm tips thành công",
  "status": 200
}
```

---

### 6. Like/Unlike Tip

**POST** `/api/tips/:id/like`

Thích hoặc bỏ thích một tip (yêu cầu đăng nhập).

#### Request

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Parameters:**

- `id` (number): ID của tip

#### Response

**Success (200):**

```json
{
  "data": {
    "tip_id": 1,
    "liked": true,
    "total_likes": 90
  },
  "message": "Đã thích tip",
  "status": 200
}
```

---

### 7. Lấy Tips Yêu Thích

**GET** `/api/tips/favorites`

Lấy danh sách tips mà user đã thích.

#### Request

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

- `page` (number, optional): Số trang
- `limit` (number, optional): Số items per page

#### Response

**Success (200):**

```json
{
  "data": {
    "items": [
      {
        "id": 1,
        "title": "Uống đủ nước mỗi ngày",
        "content": "Hãy duy trì thói quen uống đủ nước...",
        "category": "nutrition",
        "liked_at": "2025-10-12T00:00:00Z"
      }
    ],
    "total": 3,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "message": "Lấy tips yêu thích thành công",
  "status": 200
}
```

---

## Data Models

### Tips Entity

```typescript
interface Tips {
  id: number;
  title: string;
  content: string;
  detailed_content?: string;
  category: 'nutrition' | 'exercise' | 'sleep' | 'mental_health' | 'general';
  priority: number; // 1 = highest priority
  image_url?: string;
  tags: string[];
  author: string;
  author_bio?: string;
  references?: string[];
  related_tips?: number[];
  views: number;
  likes: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
```

### TipLike Entity

```typescript
interface TipLike {
  id: number;
  user_id: number;
  tip_id: number;
  created_at: Date;
}
```

### TipView Entity

```typescript
interface TipView {
  id: number;
  user_id?: number; // Optional for guest users
  tip_id: number;
  ip_address: string;
  user_agent: string;
  created_at: Date;
}
```

---

## Categories

### Danh Mục Tips

| Category      | Tên Tiếng Việt     | Mô tả                              |
| ------------- | ------------------ | ---------------------------------- |
| nutrition     | Dinh dưỡng         | Tips về ăn uống, chế độ dinh dưỡng |
| exercise      | Tập luyện          | Tips về thể dục, thể thao          |
| sleep         | Giấc ngủ           | Tips về chất lượng giấc ngủ        |
| mental_health | Sức khỏe tinh thần | Tips về stress, meditation         |
| general       | Tổng quát          | Tips chung về sức khỏe             |

### Tags Phổ Biến

```javascript
const commonTags = [
  // Nutrition
  'nước',
  'vitamin',
  'protein',
  'chất xơ',
  'rau củ',
  'trái cây',

  // Exercise
  'cardio',
  'cơ bắp',
  'yoga',
  'đi bộ',
  'gym',
  'stretching',

  // Sleep
  'ngủ sâu',
  'thư giãn',
  'hormone',
  'circadian rhythm',

  // Mental Health
  'stress',
  'thiền',
  'mindfulness',
  'cân bằng',
  'hạnh phúc',

  // General
  'phòng bệnh',
  'miễn dịch',
  'sức khỏe tổng quát',
];
```

---

## Business Logic

### Tip Recommendation Algorithm

```javascript
function recommendTips(user) {
  const factors = {
    userPreferences: 0.4, // Danh mục user thích
    viewHistory: 0.3, // Lịch sử xem
    popularityScore: 0.2, // Độ phổ biến
    timeOfDay: 0.1, // Thời gian trong ngày
  };

  // Calculate recommendation score
  return tips.sort((a, b) => {
    const scoreA = calculateRecommendationScore(a, user, factors);
    const scoreB = calculateRecommendationScore(b, user, factors);
    return scoreB - scoreA;
  });
}
```

### View Tracking

- Đếm view khi user xem tip chi tiết > 5 giây
- Không đếm multiple views từ cùng IP trong 1 giờ
- Guest users được track qua IP + User Agent

### Like System

- User phải đăng nhập để like
- Mỗi user chỉ like 1 lần per tip
- Unlike sẽ giảm counter

---

## Caching Strategy

### Redis Caching

```javascript
// Cache frequently accessed tips
const cacheKeys = {
  allTips: 'tips:all',
  tipsByCategory: 'tips:category:{category}',
  featuredTips: 'tips:featured',
  popularTips: 'tips:popular',
  tipDetail: 'tips:detail:{id}',
};

// Cache TTL
const cacheTTL = {
  allTips: 3600, // 1 hour
  tipsByCategory: 1800, // 30 minutes
  tipDetail: 7200, // 2 hours
  popularTips: 300, // 5 minutes
};
```

---

## Error Handling

### Common Errors

| Code | Message           | Description           |
| ---- | ----------------- | --------------------- |
| 404  | Not Found         | Tip không tồn tại     |
| 400  | Bad Request       | Category không hợp lệ |
| 401  | Unauthorized      | Cần đăng nhập để like |
| 429  | Too Many Requests | Quá nhiều requests    |

### Validation Errors

```json
{
  "statusCode": 400,
  "message": [
    "Category phải là một trong: nutrition, exercise, sleep, mental_health, general",
    "Page phải là số nguyên dương"
  ],
  "error": "Bad Request"
}
```

---

## Analytics & Tracking

### Metrics to Track

1. **View Metrics**:
   - Tổng số views per tip
   - Views theo thời gian
   - View duration

2. **Engagement Metrics**:
   - Like rate
   - Comment rate (nếu có)
   - Share rate

3. **Content Performance**:
   - Tips phổ biến nhất
   - Category được xem nhiều nhất
   - Search queries phổ biến

### Analytics Endpoints (Admin)

```javascript
// GET /api/admin/tips/analytics
{
  "total_tips": 150,
  "total_views": 50000,
  "total_likes": 3500,
  "top_categories": [
    { "category": "nutrition", "views": 20000 },
    { "category": "exercise", "views": 15000 }
  ],
  "top_tips": [
    { "id": 1, "title": "Uống nước", "views": 5000 }
  ]
}
```

---

## Content Management

### Admin Features

1. **CRUD Operations**: Tạo, sửa, xóa tips
2. **Content Moderation**: Duyệt tips từ contributors
3. **Featured Management**: Quản lý tips nổi bật
4. **Analytics Dashboard**: Thống kê performance

### Content Guidelines

1. **Độ dài**:
   - Title: 50-100 ký tự
   - Content: 100-500 ký tự
   - Detailed content: 500-2000 ký tự

2. **Chất lượng**:
   - Thông tin chính xác, có căn cứ khoa học
   - Ngôn ngữ dễ hiểu, thân thiện
   - Có tham khảo từ nguồn uy tín

3. **SEO**:
   - Keywords trong title và content
   - Meta description cho tips
   - Alt text cho images

---

## Testing

### Unit Tests

```javascript
describe('TipsController', () => {
  describe('getAllTips', () => {
    it('should return all active tips', async () => {
      // Test implementation
    });

    it('should handle category filtering', async () => {
      // Test category filter
    });
  });

  describe('likeTip', () => {
    it('should like tip successfully', async () => {
      // Test like functionality
    });

    it('should unlike when already liked', async () => {
      // Test unlike functionality
    });
  });
});
```

### cURL Examples

**Get all tips:**

```bash
curl -X POST http://localhost:3000/api/tips \
  -H "Content-Type: application/json"
```

**Get tips by category:**

```bash
curl -X GET "http://localhost:3000/api/tips/category/nutrition?page=1&limit=5"
```

**Search tips:**

```bash
curl -X GET "http://localhost:3000/api/tips/search?q=nước&category=nutrition"
```

**Like a tip:**

```bash
curl -X POST http://localhost:3000/api/tips/1/like \
  -H "Authorization: Bearer your_jwt_token"
```

---

## Changelog

### v1.0.0 (2025-10-12)

- Initial tips management system
- Category-based organization
- Search functionality
- Like/unlike system
- View tracking
- Caching implementation

---

_Cập nhật lần cuối: 12/10/2025_
