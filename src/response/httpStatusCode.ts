export const HTTP_STATUS = {
  // 2xx: Success
  OK: 200, // Thành công
  CREATED: 201, // Tạo mới thành công
  ACCEPTED: 202, // Đã nhận request nhưng chưa xử lý xong
  NO_CONTENT: 204, // Thành công nhưng không có dữ liệu trả về

  // 4xx: Client Error
  BAD_REQUEST: 400, // Request không hợp lệ
  UNAUTHORIZED: 401, // Chưa xác thực
  PAYMENT_REQUIRED: 402, // Yêu cầu thanh toán (ít khi dùng)
  FORBIDDEN: 403, // Không có quyền truy cập
  NOT_FOUND: 404, // Không tìm thấy tài nguyên
  METHOD_NOT_ALLOWED: 405, // Phương thức không được phép
  CONFLICT: 409, // Xung đột dữ liệu
  UNPROCESSABLE_ENTITY: 422, // Dữ liệu không hợp lệ (thường dùng khi validate form)
  TOO_MANY_REQUESTS: 429, // Quá nhiều request trong thời gian ngắn (rate limit)

  // 5xx: Server Error
  INTERNAL_SERVER_ERROR: 500, // Lỗi server nội bộ
  NOT_IMPLEMENTED: 501, // Chưa được hỗ trợ
  BAD_GATEWAY: 502, // Gateway nhận được phản hồi không hợp lệ
  SERVICE_UNAVAILABLE: 503, // Dịch vụ tạm thời không khả dụng
  GATEWAY_TIMEOUT: 504, // Gateway timeout (hết thời gian chờ)
} as const;

export default HTTP_STATUS;
