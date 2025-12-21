# Food Recommendation API

## Tổng quan

API này cung cấp danh sách các thực phẩm được khuyến nghị hoặc nên hạn chế dựa trên hồ sơ sức khỏe của người dùng. Hệ thống hỗ trợ tìm kiếm, lọc theo nhiều tiêu chí và phân trang kết quả.

## 1. Lấy danh sách thực phẩm khuyến nghị theo Health Document

**POST** `/api/food-recommendations/get`

### Mô tả

API này trả về danh sách thực phẩm dựa trên hồ sơ sức khỏe (health document) với các tính năng:

- Tự động xác định tình trạng sức khỏe từ health document
- Hỗ trợ 2 loại khuyến nghị: NENAN (nên ăn) và HANCHEAN (hạn chế ăn)
- Tìm kiếm theo tên thực phẩm (hỗ trợ nhiều từ khóa)
- Lọc theo nhóm thực phẩm, mức béo, mức GI
- Phân trang kết quả
- Sắp xếp thông minh dựa trên tình trạng sức khỏe

### Logic nghiệp vụ

1. **Xác định tình trạng sức khỏe:**
   - Lấy health document từ healthDocumentId
   - Kiểm tra thông tin: chiều cao, cân nặng, giới tính, ngày sinh
   - Tính BMI để xác định tình trạng sức khỏe (nếu chưa có)
   - Lấy health status ID

2. **Truy vấn thực phẩm:**
   - Join bảng `hm_health_food_recommendation` với `foods`
   - Filter theo health status và typeAdvice (NENAN/HANCHEAN)
   - Áp dụng các bộ lọc: search, food groups, fat levels, GI levels

3. **Sắp xếp kết quả:**
   - **NENAN (Nên ăn):** Không ưu tiên nhóm, chỉ sort trong nhóm
   - **HANCHEAN (Hạn chế):** Có thứ tự ưu tiên nhóm dựa trên bệnh
   - Trong mỗi nhóm: Sort theo mức béo/GI hoặc ABC

4. **Phân trang:**
   - Trả về page và limit theo yêu cầu
   - Kèm thông tin tổng số trang, tổng số records

### Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Request Body Parameters

| Tham số          | Loại     | Bắt buộc | Mô tả                                                            |
| ---------------- | -------- | -------- | ---------------------------------------------------------------- |
| healthDocumentId | number   | Có       | ID hồ sơ sức khỏe                                                |
| typeAdvice       | enum     | Có       | "NENAN" (Nên ăn) hoặc "HANCHEAN" (Hạn chế ăn)                    |
| search           | string   | Không    | Tìm kiếm theo tên (hỗ trợ nhiều từ khóa, cách nhau bởi dấu phẩy) |
| foodGroups       | string[] | Không    | Mảng mã nhóm thực phẩm                                           |
| fatLevels        | string[] | Không    | Mảng mức béo (MUCBEO1, MUCBEO2, ...)                             |
| giLevels         | string[] | Không    | Mảng mức GI (GITHAP, GITRUNGBINH, GICAO)                         |
| page             | number   | Không    | Số trang (mặc định: 1)                                           |
| limit            | number   | Không    | Số items/trang (mặc định: 10)                                    |

### Nhóm thực phẩm (foodGroups)

```typescript
[
  'THUCPHAMGIAUCHATBOTDUONG', // Thực phẩm giàu chất bột đường
  'THUCPHAMGIAUCHATDAM', // Thực phẩm giàu chất đạm
  'THUCPHAMGIAUCHATBEO', // Thực phẩm giàu chất béo
  'RAUCUQUA', // Rau củ quả
  'TRAICAY', // Trái cây
  'HATDAUMOBO', // Hạt & dầu, mỡ, bơ
  'SUAVACACSANPHAMTUSUA', // Sữa và sản phẩm từ sữa
  'KHAC', // Khác
];
```

### Request Example - Tab "Nên ăn"

```json
POST /api/food-recommendations/get
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "healthDocumentId": 123,
  "typeAdvice": "NENAN",
  "search": "bí đỏ, đậu hà lan",
  "foodGroups": ["THUCPHAMGIAUCHATDAM", "RAUCUQUA"],
  "fatLevels": ["MUCBEO1", "MUCBEO2"],
  "giLevels": ["GITHAP", "GITRUNGBINH"],
  "page": 1,
  "limit": 10
}
```

### Response Success (200)

```json
{
  "data": {
    "healthStatusId": "DIABETES",
    "listData": [
      {
        "ID": 531,
        "NAME": "Ba chỉ bò",
        "IMAGE": "https://...",
        "IMAGE_COOKED": "https://...",
        "ENERGY": 174.33,
        "FAT": 9.49,
        "PROTEIN": 21.5,
        "GROUP_FOOD": "THUCPHAMGIAUCHATDAM",
        "FOOD_GROUP_NAME": "Thực phẩm giàu chất đạm",
        "PROTEIN_CLASSIFICATION": "MUCBEO2",
        "SUGAR_CLASSIFICATION": "GITRUNGBINH",
        "FRUIT_CLASSIFICATION": null
      }
    ],
    "paging": {
      "curPage": 1,
      "limitPage": 10,
      "totalRows": 245,
      "totalPage": 25
    }
  },
  "message": "Lấy dữ liệu thành công!",
  "status": 200
}
```

### Response Error (404)

```json
{
  "message": "Hồ sơ sức khỏe không tồn tại!",
  "status": 404
}
```

## Hướng dẫn test với Postman

### Test Case 1: Lấy danh sách "Nên ăn"

**Method:** POST  
**URL:** `{{baseUrl}}/api/food-recommendations/get`

**Headers:**

```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**

```json
{
  "healthDocumentId": 1,
  "typeAdvice": "NENAN",
  "page": 1,
  "limit": 10
}
```

**Kiểm tra:**

- Status: 200
- Response có `listData` và `paging`
