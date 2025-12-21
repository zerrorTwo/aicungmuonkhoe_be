# Meal Planner API

## Tổng quan

API quản lý kế hoạch bữa ăn (meal planner) cho phép người dùng tạo, xem, cập nhật và xóa kế hoạch bữa ăn hàng ngày. Mỗi kế hoạch bao gồm nhiều bữa ăn và mỗi bữa có thể chứa nhiều món ăn. Hệ thống cũng hỗ trợ đánh dấu bữa ăn đã ăn để theo dõi tiến độ.

## 1. Tạo kế hoạch bữa ăn mới

**POST** `/api/meal-planner`

### Mô tả

API này tạo một kế hoạch bữa ăn mới cho một ngày cụ thể. Hệ thống sẽ:

- Kiểm tra xem đã có kế hoạch cho ngày này chưa (tránh trùng lặp)
- Tạo meal planner container
- Tạo các bữa ăn (meals) trong ngày
- Gán các món ăn (dishes) vào từng bữa

### Logic nghiệp vụ

1. **Kiểm tra trùng lặp:**
   - Một health document chỉ có 1 kế hoạch cho mỗi ngày
   - Nếu đã tồn tại, trả về lỗi conflict

2. **Tạo meal planner:**
   - Lưu HEALTH_DOCUMENT_ID và PLAN_DATE
   - Ghi nhận người tạo (CREATED_BY)

3. **Tạo meals:**
   - Mỗi bữa ăn có MEAL_TYPE_CODE (BS, BTR, BP, BT)
   - MEAL_ORDER hỗ trợ nhiều bữa phụ (BP1, BP2...)
   - EATEN = 0 (chưa ăn) mặc định

4. **Gán dishes:**
   - Mỗi món có DISH_ID và DISH_SALT_FORMULA_ID
   - DISH_SALT_FORMULA_ID phù hợp với tình trạng sức khỏe

### Headers

```
Authorization: Bearer <access_token>
```

### Request Body

```json
{
  "healthDocumentId": 1,
  "planDate": "2025-12-13",
  "meals": [
    {
      "mealTypeCode": "BS",
      "mealOrder": 1,
      "dishes": [
        {
          "dishId": 101,
          "dishSaltFormulaId": 1
        },
        {
          "dishId": 102,
          "dishSaltFormulaId": 1
        }
      ]
    },
    {
      "mealTypeCode": "BTR",
      "mealOrder": 1,
      "dishes": [
        {
          "dishId": 201,
          "dishSaltFormulaId": 1
        },
        {
          "dishId": 202,
          "dishSaltFormulaId": 1
        },
        {
          "dishId": 203,
          "dishSaltFormulaId": 1
        }
      ]
    },
    {
      "mealTypeCode": "BP",
      "mealOrder": 1,
      "dishes": [
        {
          "dishId": 301,
          "dishSaltFormulaId": 1
        }
      ]
    },
    {
      "mealTypeCode": "BT",
      "mealOrder": 1,
      "dishes": [
        {
          "dishId": 401,
          "dishSaltFormulaId": 1
        },
        {
          "dishId": 402,
          "dishSaltFormulaId": 1
        }
      ]
    }
  ]
}
```

### Response Success (201)

```json
{
  "data": {
    "mealPlannerId": 1,
    "healthDocumentId": 1,
    "planDate": "2025-12-13",
    "createdAt": "2025-12-13T10:30:00Z",
    "meals": [
      {
        "mealId": 1,
        "mealTypeCode": "BS",
        "mealTypeName": "Bữa sáng",
        "mealOrder": 1,
        "eaten": false,
        "dishes": [
          {
            "dishId": 101,
            "dishName": "Phở bò",
            "dishSaltFormulaId": 1
          },
          {
            "dishId": 102,
            "dishName": "Trứng luộc",
            "dishSaltFormulaId": 1
          }
        ]
      },
      {
        "mealId": 2,
        "mealTypeCode": "BTR",
        "mealTypeName": "Bữa trưa",
        "mealOrder": 1,
        "eaten": false,
        "dishes": [
          {
            "dishId": 201,
            "dishName": "Cơm gạo lứt",
            "dishSaltFormulaId": 1
          },
          {
            "dishId": 202,
            "dishName": "Cá hồi nướng",
            "dishSaltFormulaId": 1
          },
          {
            "dishId": 203,
            "dishName": "Rau luộc",
            "dishSaltFormulaId": 1
          }
        ]
      }
    ]
  },
  "message": "Meal plan created successfully",
  "status": 201
}
```

### Response Error (409 - Conflict)

```json
{
  "message": "Meal planner already exists for this date",
  "status": 409
}
```

---

## 2. Lấy kế hoạch bữa ăn theo ID

**GET** `/api/meal-planner/:id`

### Mô tả

Lấy thông tin chi tiết của một kế hoạch bữa ăn cụ thể, bao gồm tất cả bữa ăn và món ăn.

### Headers

```
Authorization: Bearer <access_token>
```

### Parameters

| Tham số | Loại   | Vị trí | Bắt buộc | Mô tả               |
| ------- | ------ | ------ | -------- | ------------------- |
| id      | number | Path   | Có       | ID của meal planner |

### Request Example

```
GET /api/meal-planner/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response Success (200)

```json
{
  "data": {
    "mealPlannerId": 1,
    "healthDocumentId": 1,
    "planDate": "2025-12-13",
    "createdAt": "2025-12-13T10:30:00Z",
    "updatedAt": "2025-12-13T10:30:00Z",
    "meals": [
      {
        "mealId": 1,
        "mealTypeCode": "BS",
        "mealTypeName": "Bữa sáng",
        "mealOrder": 1,
        "eaten": false,
        "dishes": [
          {
            "dishId": 101,
            "dishName": "Phở bò",
            "dishSaltFormulaId": 1,
            "dishSaltFormulaName": "Công thức muối tiêu chuẩn"
          }
        ]
      }
    ]
  },
  "message": "Meal planner retrieved successfully",
  "status": 200
}
```

### Response Error (404)

```json
{
  "message": "Meal planner not found",
  "status": 404
}
```

---

## 3. Lấy danh sách kế hoạch bữa ăn theo Health Document

**GET** `/api/meal-planner`

### Mô tả

Lấy danh sách tất cả các kế hoạch bữa ăn của một health document trong khoảng thời gian cụ thể.

### Headers

```
Authorization: Bearer <access_token>
```

### Query Parameters

| Tham số          | Loại   | Bắt buộc | Mô tả                      |
| ---------------- | ------ | -------- | -------------------------- |
| healthDocumentId | number | Có       | ID của health document     |
| startDate        | string | Không    | Ngày bắt đầu (YYYY-MM-DD)  |
| endDate          | string | Không    | Ngày kết thúc (YYYY-MM-DD) |

### Request Example

```
GET /api/meal-planner?healthDocumentId=1&startDate=2025-12-01&endDate=2025-12-31
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response Success (200)

```json
{
  "data": [
    {
      "mealPlannerId": 1,
      "healthDocumentId": 1,
      "planDate": "2025-12-13",
      "totalMeals": 4,
      "mealsEaten": 2,
      "meals": [
        {
          "mealId": 1,
          "mealTypeCode": "BS",
          "eaten": true
        },
        {
          "mealId": 2,
          "mealTypeCode": "BTR",
          "eaten": true
        },
        {
          "mealId": 3,
          "mealTypeCode": "BP",
          "eaten": false
        },
        {
          "mealId": 4,
          "mealTypeCode": "BT",
          "eaten": false
        }
      ]
    },
    {
      "mealPlannerId": 2,
      "healthDocumentId": 1,
      "planDate": "2025-12-14",
      "totalMeals": 3,
      "mealsEaten": 0,
      "meals": [
        {
          "mealId": 5,
          "mealTypeCode": "BS",
          "eaten": false
        }
      ]
    }
  ],
  "message": "Meal planners retrieved successfully",
  "status": 200
}
```

---

## 4. Cập nhật kế hoạch bữa ăn

**PUT** `/api/meal-planner/:id`

### Mô tả

Cập nhật kế hoạch bữa ăn hiện có. Có thể thêm, sửa, xóa bữa ăn và món ăn.

### Logic nghiệp vụ

1. **Cập nhật meals:**
   - Xóa tất cả bữa ăn cũ
   - Tạo lại bữa ăn mới theo request body

2. **Tracking:**
   - Cập nhật UPDATED_BY và UPDATED_AT

### Headers

```
Authorization: Bearer <access_token>
```

### Parameters

| Tham số | Loại   | Vị trí | Bắt buộc | Mô tả               |
| ------- | ------ | ------ | -------- | ------------------- |
| id      | number | Path   | Có       | ID của meal planner |

### Request Body

```json
{
  "meals": [
    {
      "mealTypeCode": "BS",
      "mealOrder": 1,
      "dishes": [
        {
          "dishId": 105,
          "dishSaltFormulaId": 2
        }
      ]
    },
    {
      "mealTypeCode": "BTR",
      "mealOrder": 1,
      "dishes": [
        {
          "dishId": 205,
          "dishSaltFormulaId": 2
        },
        {
          "dishId": 206,
          "dishSaltFormulaId": 2
        }
      ]
    }
  ]
}
```

### Response Success (200)

```json
{
  "data": {
    "mealPlannerId": 1,
    "healthDocumentId": 1,
    "planDate": "2025-12-13",
    "updatedAt": "2025-12-13T15:45:00Z",
    "meals": [
      {
        "mealId": 10,
        "mealTypeCode": "BS",
        "dishes": [
          {
            "dishId": 105,
            "dishName": "Bánh mì trứng"
          }
        ]
      }
    ]
  },
  "message": "Meal planner updated successfully",
  "status": 200
}
```

---

## 5. Xóa kế hoạch bữa ăn

**DELETE** `/api/meal-planner/:id`

### Mô tả

Xóa hoàn toàn một kế hoạch bữa ăn. Tất cả bữa ăn và món ăn liên quan sẽ bị xóa theo (cascade delete).

### Headers

```
Authorization: Bearer <access_token>
```

### Parameters

| Tham số | Loại   | Vị trí | Bắt buộc | Mô tả               |
| ------- | ------ | ------ | -------- | ------------------- |
| id      | number | Path   | Có       | ID của meal planner |

### Request Example

```
DELETE /api/meal-planner/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response Success (200)

```json
{
  "data": null,
  "message": "Meal planner deleted successfully",
  "status": 200
}
```

### Response Error (404)

```json
{
  "message": "Meal planner not found",
  "status": 404
}
```

---

## 6. Đánh dấu bữa ăn đã ăn

**POST** `/api/meal-planner/mark-eaten`

### Mô tả

Đánh dấu một bữa ăn cụ thể đã ăn hoặc chưa ăn. Dùng để theo dõi tiến độ thực hiện kế hoạch.

### Logic nghiệp vụ

1. **Cập nhật trạng thái:**
   - Set EATEN = 1 (đã ăn) hoặc 0 (chưa ăn)
   - Cập nhật UPDATED_BY và UPDATED_AT

2. **Tracking:**
   - Giúp người dùng theo dõi việc tuân thủ kế hoạch
   - Có thể dùng cho báo cáo thống kê

### Headers

```
Authorization: Bearer <access_token>
```

### Request Body

```json
{
  "mealId": 1,
  "eaten": true
}
```

### Response Success (200)

```json
{
  "data": null,
  "message": "Meal status updated successfully",
  "status": 200
}
```

### Response Error (404)

```json
{
  "message": "Meal not found",
  "status": 404
}
```

---

## Hướng dẫn test với Postman

### Test Case 1: Tạo kế hoạch bữa ăn mới

**Method:** POST

**URL:** `{{baseUrl}}/api/meal-planner`

**Headers:**

```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "healthDocumentId": 1,
  "planDate": "2025-12-15",
  "meals": [
    {
      "mealTypeCode": "BS",
      "mealOrder": 1,
      "dishes": [
        {
          "dishId": 101,
          "dishSaltFormulaId": 1
        }
      ]
    },
    {
      "mealTypeCode": "BTR",
      "mealOrder": 1,
      "dishes": [
        {
          "dishId": 201,
          "dishSaltFormulaId": 1
        },
        {
          "dishId": 202,
          "dishSaltFormulaId": 1
        }
      ]
    }
  ]
}
```

**Kiểm tra:**

- Status: 201
- Response có mealPlannerId
- Meals được tạo đầy đủ

### Test Case 2: Lấy kế hoạch theo ID

**Method:** GET

**URL:** `{{baseUrl}}/api/meal-planner/1`

**Headers:**

```
Authorization: Bearer {{accessToken}}
```

**Kiểm tra:**

- Status: 200
- Data có đầy đủ thông tin meals và dishes
- eaten = false cho bữa ăn mới tạo

### Test Case 3: Lấy danh sách theo khoảng thời gian

**Method:** GET

**URL:** `{{baseUrl}}/api/meal-planner?healthDocumentId=1&startDate=2025-12-01&endDate=2025-12-31`

**Headers:**

```
Authorization: Bearer {{accessToken}}
```

**Kiểm tra:**

- Status: 200
- Mảng chứa nhiều meal planners
- Sắp xếp theo planDate

### Test Case 4: Đánh dấu đã ăn

**Method:** POST

**URL:** `{{baseUrl}}/api/meal-planner/mark-eaten`

**Headers:**

```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**

```json
{
  "mealId": 1,
  "eaten": true
}
```

**Kiểm tra:**

- Status: 200
- Lấy lại meal planner, kiểm tra eaten = true

### Test Case 5: Cập nhật kế hoạch

**Method:** PUT

**URL:** `{{baseUrl}}/api/meal-planner/1`

**Headers:**

```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**

```json
{
  "meals": [
    {
      "mealTypeCode": "BS",
      "mealOrder": 1,
      "dishes": [
        {
          "dishId": 999,
          "dishSaltFormulaId": 1
        }
      ]
    }
  ]
}
```

**Kiểm tra:**

- Status: 200
- Meals cũ bị xóa, meals mới được tạo

### Test Case 6: Xóa kế hoạch

**Method:** DELETE

**URL:** `{{baseUrl}}/api/meal-planner/1`

**Headers:**

```
Authorization: Bearer {{accessToken}}
```

**Kiểm tra:**

- Status: 200
- GET lại với ID đó sẽ trả về 404

### Test Case 7: Tạo trùng ngày (Conflict)

**Method:** POST

**URL:** `{{baseUrl}}/api/meal-planner`

**Body:** Dùng healthDocumentId và planDate đã tồn tại

**Kiểm tra:**

- Status: 409
- Message: "Meal planner already exists for this date"

---

## Lưu ý quan trọng

### 1. Cấu trúc dữ liệu

- **Meal Planner (Container)**
  - Chứa thông tin ngày và health document
  - Mỗi ngày chỉ có 1 planner

- **Meal (Bữa ăn)**
  - BS: Bữa sáng
  - BTR: Bữa trưa
  - BP: Bữa phụ (có thể có nhiều: BP1, BP2 dùng mealOrder)
  - BT: Bữa tối
  - BC: Bữa chính (nếu có)

- **Dish (Món ăn)**
  - Mỗi bữa có thể có nhiều món
  - Dish Salt Formula ID: Công thức muối phù hợp với sức khỏe

### 2. Business Rules

1. **Unique constraint:**
   - (healthDocumentId + planDate) phải unique
   - (mealPlannerId + mealTypeCode + mealOrder) phải unique
   - (mealPlannerMealId + dishSaltFormulaId) phải unique

2. **Cascade delete:**
   - Xóa meal planner → xóa tất cả meals
   - Xóa meal → xóa tất cả dishes của meal đó

3. **Tracking:**
   - eaten flag: Theo dõi việc thực hiện kế hoạch
   - createdBy, updatedBy: Audit trail

### 3. Tích hợp với các API khác

- **Nutrition API:** Lấy thông tin dinh dưỡng để tạo kế hoạch phù hợp
- **Food Recommendation API:** Chọn món ăn phù hợp với tình trạng sức khỏe
- **Dish API:** Lấy thông tin chi tiết món ăn và công thức muối

### 4. Best Practices

1. **Tạo kế hoạch:**
   - Nên tạo trước 1-2 ngày
   - Chọn món ăn đa dạng, cân bằng dinh dưỡng

2. **Theo dõi:**
   - Đánh dấu eaten sau mỗi bữa
   - Xem báo cáo để cải thiện thói quen

3. **Cập nhật:**
   - Có thể thay đổi linh hoạt theo hoàn cảnh
   - Giữ lại lịch sử để phân tích
