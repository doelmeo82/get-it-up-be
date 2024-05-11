export const REQUEST_ID_TOKEN_HEADER = 'x-request-id';

export const FORWARDED_FOR_TOKEN_HEADER = 'x-forwarded-for';

export const MESSAGES = {
  GET_SUCCEED: 'get_succeed',
  CREATED_SUCCEED: 'Tạo thành công!',
  ADD_CART_SUCCEED: 'Thêm vào giỏ hàng thành công',
  DELETE_SUCCEED: 'Xóa thành công',
  UPDATE_SUCCEED: 'Cập nhật thành công',
  UPDATE_OR_CREATE_SUCCEED: 'update_or_create_succeed',
  CANNOT_GET_DATA: 'cannot_get_data',
  CANNOT_CREATE: 'cannot_create_new_model',
  CANNOT_DELETE: 'Không thể xóa',
  CANNOT_UPDATE: 'Không thể cập nhật',
  CANNOT_UPDATE_OR_CREATE: 'Không thể thêm hoặc cập nhật',
  INSERT_SUCCEED: 'Thêm mới thành công',
  OK: 'ok',
  WRONG_PASSWORD: 'Sai mật khẩu',
  PERMISSION_DENIED: 'Không có quyền',
  UNAUTHORIZED: 'Xác thực thất bại!',
  INVALID_TOKEN: 'invalid_token',
  UPLOAD_IMAGE_SUCCES: 'upload thành công',
  CANNOT_UPLOAD_IMAGE: 'upload không thành công',
  INVALID_QUERY: 'invalid_query',
  INVALID_PARAM: 'invalid_param',
  UNAUTHORIZED_ADMIN: 'Không có quyền admin',
  NOT_FOUND_USER: 'Không tìm thấy tài khoản',
  NOT_FOUND: 'Không tìm thấy',
  INVALID_CODE: 'invalid_code',
  VERIFY_SUCCESS: 'Xác thực thành công',
  CONFIRMED_ACCOUNT: 'Kích hoạt tài khoản thành công',
  UNCONFIRMED_ACCOUNT: 'Tài khoản chưa được kích hoạt',
  ROLE_NOT_FOUND: 'role_not_found',
  EMAIL_EXISTS: 'Email đã tồn tại',
  RESEND_SUCCESS: 'Gửi lại mã xác thực thành công',
  SENT_EMAIL_TO_RECOVER_PASSWORD: 'Đã gửi mail để khôi phục mật khẩu',
  USERNAME_EXISTS: 'Username đã tồn tại',
  FINISH_EXAM: 'Nộp bài thành công',
  DISABLED_ACCOUNT: 'Tài khoản của bạn đã bị vô hiệu hóa',
  APPROVE_BLOG_SUCCESS: 'Duyệt bài viết thành công',
};

export const VNPAY_MESSAGE = {
  FAIL_CHECKSUM: 'Không xác thực được',
  WRONG_ORDER: 'Sai thông tin đơn hàng',
  TRANSACTION_FAIL: 'Giao dịch thất bại',
  PAYMENT_SUCCESS: 'Thanh toán thành công',
};

export const VNPAY_RESPONSE_CODE = {
  CANCLE_TRANSACTION: '24',
  TRANSACTION_SUCCESS: '00',
  INVALID_SIGNED: '70',
};

export const MAIL_TEMPLATE = {
  VERIFY_EMAIL_TEMPLATE: 'verify-email',
  FORGOT_PASSWORD_TEMPLATE: 'forgot-password',
  UPDATE_EMAIL_TEMPLATE: 'update-email',
  TEACHER_ACCOUNT_TEMPLATE: 'teacher-account',
};

export const VIEW_TEMPLATE = {
  PAYMENT_SUCCESS: 'payment-success',
  CANCLE_TRANSACTION: 'cancle-transaction',
};
