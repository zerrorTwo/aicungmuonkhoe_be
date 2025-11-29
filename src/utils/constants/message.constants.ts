export const ErrorMessages = {
  LOGIN_FAIL: 'Login failed. Please check your credentials.',
  INVALID_MS_TOKEN: 'Invalid Microsoft token.',
  FAIL_EMAIL_VERIFY: 'Failed to verify email.',
  NO_PERMISSION_ACCEPT: 'You do not have permission to access this resource.',
  FORMAT_DATA_IS_WRONG: 'Format data is wrong.',
  MEALTIME_EXIST: 'Thiết lập giờ ăn đã tồn tại',
  NOTIFICATION_IS_NOT_FOUND: 'Thông báo không tồn tại',
};

export const SuccessMessages = {
  SIGN_IN_SUCCESSFULLY: 'Đăng nhập thành công',
  SIGN_UP_SUCCESSFULLY: 'Đăng ký thành công',
  EMAIL_VERIFICATION_SUCCESSFULLY: 'Xác thực email thành công',
  LOGGED: 'Đăng xuất!',
  ACCESS_TOKEN_SUCCESSFULLY: 'Tải mới access_token thành công!',
  CREATE_SUCCESSFULLY: 'Tạo thành công!',
  GET_SUCCESSFULLY: 'Lấy dữ liệu thành công!',
  VALIDATION_OTP_SUCCESSFULLY: 'Kiểm tra OTP thành công!',
  UPDATE_SUCCESSFULLY: 'Sửa thành công!',
  DELETE_SUCCESSFULLY: 'Xoá thành công!',
  RESEND_PASSWORD_SUCCESSFULLY: 'Vui lồng kiểm tra email của bạn!',
  CHANGE_PASSWORD_SUCCESSFULLY: 'Đổi mật khẩu thành công.',
  SUCCESSFULLY: 'Thành công',
  SETTING_SUCCESSFULLY: 'Cài đặt thành công!',
  ADD_DEPARTMENT_TO_MEALTIME_SUCCESSFULLY:
    'Đã thêm phòng ban vào thiết lập giờ ăn',
  FETCH_PROVINCES_SUCCESSFULLY: 'Lấy dữ liệu các tỉnh thành công',
  FETCH_GENDERS_SUCCESSFULLY: 'Lấy dữ liệu giới tính thành công',
};

export const importErrorMessages = {
  DATE_INPUT_ERROR: 'Dữ liệu Ngày ăn chưa phù hợp',
  EMPLOYEE_CODE_NOT_EXIST: 'MSNV không có trong hệ thống',
  FULL_NAME_INPUT_ERROR: 'Dữ liệu Họ và tên chưa phù hợp',
  MEAL_TYPE_INPUT_ERROR: 'User nhập vào khác các bữa: TRƯA, TỐI, KHUYA',
  SHIFT_INPUT_ERROR: 'User nhập vào khác ca làm việc ca 1, 2, 3, D',
  TIME_RANGE_INPUT_ERROR:
    'User nhập vào khung giờ mà trong CMS chưa thiết lập khung giờ ăn đó',
  MENU_INPUT_ERROR: 'User nhập Thực đơn khác 4 thực đơn hiện tại',
  INVALID_SHIFT_OR_TIME_FOR_MEAL:
    'Ca làm việc và Giờ ăn không hợp lệ cho Bữa ăn {meal}',
  DATE_MUST_BE_GREATER_THAN_TODAY: 'Dữ liệu ngày phải lớn hơn ngày hôm nay',
  MEAL_TIME_NOT_VALID: 'Dữ liệu Giờ ăn chưa phù hợp',
};
