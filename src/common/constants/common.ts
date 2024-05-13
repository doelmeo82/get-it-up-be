export const REQUEST_ID_TOKEN_HEADER = 'x-request-id';

export const FORWARDED_FOR_TOKEN_HEADER = 'x-forwarded-for';
export const MESSAGES = {
  GET_SUCCEED: 'Get succeed',
  CREATED_SUCCEED: 'Create success!',
  ADD_CART_SUCCEED: 'Add to cart succeed',
  DELETE_SUCCEED: 'Delete succeed',
  UPDATE_SUCCEED: 'Update succeed',
  UPDATE_OR_CREATE_SUCCEED: 'Update or create succeed',
  CANNOT_GET_DATA: 'Cannot get data',
  CANNOT_CREATE: 'Cannot create new model',
  CANNOT_DELETE: 'Cannot delete',
  CANNOT_UPDATE: 'Cannot update',
  CANNOT_UPDATE_OR_CREATE: 'Cannot update or create',
  INSERT_SUCCEED: 'Insert succeed',
  OK: 'OK',
  WRONG_PASSWORD: 'Wrong password',
  PERMISSION_DENIED: 'Permission denied',
  UNAUTHORIZED: 'Unauthorized!',
  INVALID_TOKEN: 'Invalid token',
  UPLOAD_IMAGE_SUCCES: 'Upload succeed',
  CANNOT_UPLOAD_IMAGE: 'Cannot upload image',
  INVALID_QUERY: 'Invalid query',
  INVALID_PARAM: 'Invalid parameter',
  UNAUTHORIZED_ADMIN: 'Unauthorized admin',
  NOT_FOUND_USER: 'User not found',
  NOT_FOUND: 'Not found',
  INVALID_CODE: 'Invalid code',
  VERIFY_SUCCESS: 'Verification success',
  CONFIRMED_ACCOUNT: 'Confirmed account successfully',
  UNCONFIRMED_ACCOUNT: 'Account not activated yet',
  ROLE_NOT_FOUND: 'Role not found',
  EMAIL_EXISTS: 'Email already exists',
  RESEND_SUCCESS: 'Resend verification code succeed',
  SENT_EMAIL_TO_RECOVER_PASSWORD: 'Sent email to recover password',
  USERNAME_EXISTS: 'Username already exists',
  FINISH_EXAM: 'Finish exam successfully',
  DISABLED_ACCOUNT: 'Your account has been disabled',
  APPROVE_BLOG_SUCCESS: 'Approve blog post successfully',
};

export const VNPAY_MESSAGE = {
  FAIL_CHECKSUM: 'Fail to authenticate',
  WRONG_ORDER: 'Wrong order information',
  TRANSACTION_FAIL: 'Transaction failed',
  PAYMENT_SUCCESS: 'Payment successful',
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
