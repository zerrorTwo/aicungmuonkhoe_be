# Nutrition API

## Tổng quan

API này cung cấp thông tin về tiêu chuẩn dinh dưỡng dựa trên hồ sơ sức khỏe của người dùng. Hệ thống sẽ tính toán nhu cầu năng lượng hàng ngày, phân bổ chất dinh dưỡng cho từng bữa ăn, và đưa ra khuyến nghị về rau củ, trái cây và muối.

## 1. Lấy tiêu chuẩn dinh dưỡng theo Health Document

**GET** `/api/nutrition/health-document/:id`

### Mô tả

API này lấy thông tin tiêu chuẩn dinh dưỡng phù hợp với hồ sơ sức khỏe của người dùng. Hệ thống sẽ:

- Truy vấn thông tin health document (tuổi, giới tính, cân nặng, tình trạng sức khỏe, cường độ vận động)
- Tìm tiêu chuẩn dinh dưỡng phù hợp từ database
- Tính toán năng lượng cần thiết mỗi ngày
- Phân bổ năng lượng cho từng bữa ăn (sáng, trưa, chiều, tối)
- Tính toán phân bổ chất dinh dưỡng đa lượng (Protein, Lipid, Glucid) cho mỗi bữa
- Đưa ra khuyến nghị về rau củ, trái cây và muối

### Logic nghiệp vụ

1. **Xác định tiêu chuẩn dinh dưỡng:**
   - Dựa trên độ tuổi, giới tính, cân nặng (weight range)
   - Tình trạng sức khỏe (health status)
   - Cường độ vận động (exercise intensity)

2. **Tính toán năng lượng hàng ngày:**
   - Sử dụng công thức từ cấu trúc bữa ăn (3 bữa hoặc 4 bữa)
   - Lấy trung bình của MIN và MAX cho mỗi bữa ăn
   - Tổng năng lượng = Σ(Năng lượng của tất cả các bữa)

3. **Phân bổ năng lượng theo bữa ăn:**
   - Bữa sáng (BS): % năng lượng
   - Bữa trưa (BTR): % năng lượng
   - Bữa phụ (BP): % năng lượng (nếu chọn cấu trúc 4 bữa)
   - Bữa tối (BT): % năng lượng

4. **Phân bổ chất dinh dưỡng đa lượng:**
   - Protein: 15% tổng năng lượng, 1g = 4 kcal
   - Lipid: 25% tổng năng lượng, 1g = 9 kcal
   - Glucid: 60% tổng năng lượng, 1g = 4 kcal
   - Mỗi chất được tính min/max và % cho từng bữa ăn

5. **Khuyến nghị thành phần:**
   - Rau củ: Số lượng (g) mỗi ngày và từng bữa
   - Trái cây: Số lượng (g) mỗi ngày và từng bữa
   - Muối: Số lượng (g) mỗi ngày và từng bữa

### Headers

```
Authorization: Bearer <access_token>
```

### Parameters

| Tham số       | Loại   | Vị trí | Bắt buộc | Mô tả                                        |
| ------------- | ------ | ------ | -------- | -------------------------------------------- |
| id            | number | Path   | Có       | ID của health document                       |
| mealStructure | number | Query  | Không    | Số bữa ăn trong ngày: 3 hoặc 4 (mặc định: 3) |

### Request Example

```
GET /api/nutrition/health-document/1?mealStructure=3
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response Success (200)

```json
{
  "data": {
    "nutritionalStandardId": 123,
    "ageRange": {
      "id": "A1",
      "description": "Trẻ em 6-12 tháng"
    },
    "gender": {
      "id": 1,
      "name": "Nam"
    },
    "healthStatus": {
      "id": "DIABETES",
      "displayName": "Tiểu đường"
    },
    "exerciseIntensity": {
      "id": 1,
      "name": "Nhẹ nhàng"
    },
    "weightRange": {
      "min": 60,
      "max": 70
    },
    "mealStructure": 3,
    "dailyEnergy": {
      "total": 2000,
      "unit": "kcal"
    },
    "mealEnergyDistribution": [
      {
        "mealType": "BS",
        "mealName": "Bữa sáng",
        "energyMin": 400,
        "energyMax": 500,
        "energyAverage": 450,
        "percentage": 22.5
      },
      {
        "mealType": "BTR",
        "mealName": "Bữa trưa",
        "energyMin": 700,
        "energyMax": 800,
        "energyAverage": 750,
        "percentage": 37.5
      },
      {
        "mealType": "BT",
        "mealName": "Bữa tối",
        "energyMin": 700,
        "energyMax": 800,
        "energyAverage": 800,
        "percentage": 40
      }
    ],
    "macronutrientDistribution": {
      "protein": {
        "dailyGrams": 75,
        "dailyCalories": 300,
        "percentage": 15,
        "meals": [
          {
            "mealType": "BS",
            "gramsMin": 15,
            "gramsMax": 20,
            "percentage": 22.5
          },
          {
            "mealType": "BTR",
            "gramsMin": 25,
            "gramsMax": 30,
            "percentage": 37.5
          },
          {
            "mealType": "BT",
            "gramsMin": 28,
            "gramsMax": 32,
            "percentage": 40
          }
        ]
      },
      "lipid": {
        "dailyGrams": 55.56,
        "dailyCalories": 500,
        "percentage": 25,
        "meals": [
          {
            "mealType": "BS",
            "gramsMin": 11.11,
            "gramsMax": 13.89,
            "percentage": 22.5
          },
          {
            "mealType": "BTR",
            "gramsMin": 18.52,
            "gramsMax": 23.15,
            "percentage": 37.5
          },
          {
            "mealType": "BT",
            "gramsMin": 20.83,
            "gramsMax": 25.93,
            "percentage": 40
          }
        ]
      },
      "glucid": {
        "dailyGrams": 300,
        "dailyCalories": 1200,
        "percentage": 60,
        "meals": [
          {
            "mealType": "BS",
            "gramsMin": 60,
            "gramsMax": 75,
            "percentage": 22.5
          },
          {
            "mealType": "BTR",
            "gramsMin": 105,
            "gramsMax": 120,
            "percentage": 37.5
          },
          {
            "mealType": "BT",
            "gramsMin": 112.5,
            "gramsMax": 135,
            "percentage": 40
          }
        ]
      }
    },
    "ingredientRecommendations": {
      "fruits": {
        "dailyAmount": 300,
        "unit": "g",
        "meals": {
          "BS": 100,
          "BTR": 100,
          "BP": 0,
          "BT": 100,
          "BC": 0
        }
      },
      "vegetables": {
        "dailyAmount": 400,
        "unit": "g",
        "meals": {
          "BS": 50,
          "BTR": 200,
          "BP": 0,
          "BT": 150,
          "BC": 0
        }
      },
      "salt": {
        "dailyAmount": 5,
        "unit": "g",
        "meals": {
          "BS": 1.5,
          "BTR": 2,
          "BP": 0,
          "BT": 1.5,
          "BC": 0
        }
      }
    }
  },
  "message": "Nutritional standards retrieved successfully",
  "status": 200
}
```

### Response Error (404)

```json
{
  "message": "Health document not found",
  "status": 404
}
```

### Response Error (404 - No Standard Found)

```json
{
  "message": "No nutritional standard found matching the criteria",
  "status": 404
}
```

### Hướng dẫn test với Postman

#### Bước 1: Chuẩn bị

1. Đăng nhập để lấy access token
2. Tạo health document (nếu chưa có) với đầy đủ thông tin:
   - Tuổi, giới tính, cân nặng
   - Tình trạng sức khỏe
   - Cường độ vận động

#### Bước 2: Thiết lập Request

**Method:** GET

**URL:** `{{baseUrl}}/api/nutrition/health-document/1`

Hoặc với query parameter:

**URL:** `{{baseUrl}}/api/nutrition/health-document/1?mealStructure=4`

**Headers:**

```
Authorization: Bearer {{accessToken}}
```

#### Bước 3: Gửi Request

Click "Send" để gửi request

#### Bước 4: Kiểm tra Response

**Kiểm tra thành công:**

- Status code: 200
- Response có cấu trúc đầy đủ với:
  - `dailyEnergy`: Tổng năng lượng hàng ngày
  - `mealEnergyDistribution`: Phân bổ năng lượng cho từng bữa
  - `macronutrientDistribution`: Phân bổ protein, lipid, glucid
  - `ingredientRecommendations`: Khuyến nghị rau, trái cây, muối

**Các trường hợp lỗi:**

- Status 404: Health document không tồn tại
- Status 404: Không tìm thấy tiêu chuẩn dinh dưỡng phù hợp

#### Bước 5: Test các trường hợp

**Test Case 1: Cấu trúc 3 bữa (mặc định)**

```
GET /api/nutrition/health-document/1
```

Kết quả mong đợi: Nhận được phân bổ cho BS, BTR, BT

**Test Case 2: Cấu trúc 4 bữa**

```
GET /api/nutrition/health-document/1?mealStructure=4
```

Kết quả mong đợi: Nhận được phân bổ cho BS, BTR, BP, BT

**Test Case 3: Health document không tồn tại**

```
GET /api/nutrition/health-document/99999
```

Kết quả mong đợi: Status 404

### Lưu ý quan trọng

1. **Tiêu chuẩn dinh dưỡng phù hợp:**
   - Hệ thống tự động tìm tiêu chuẩn dựa trên nhiều yếu tố
   - Nếu không tìm thấy tiêu chuẩn chính xác, sẽ trả về lỗi 404
   - Đảm bảo database có đầy đủ tiêu chuẩn cho các nhóm đối tượng

2. **Cấu trúc bữa ăn:**
   - Mặc định: 3 bữa (BS, BTR, BT)
   - Có thể chọn: 4 bữa (BS, BTR, BP, BT)
   - BP: Bữa phụ (snack)

3. **Tính toán chất dinh dưỡng:**
   - Protein: 4 kcal/g
   - Lipid: 9 kcal/g
   - Glucid: 4 kcal/g

4. **Đơn vị:**
   - Năng lượng: kcal
   - Chất dinh dưỡng: g (gram)
   - Rau/trái cây/muối: g (gram)
