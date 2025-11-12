import { NextFunction, Request, Response } from "express";
import AppError from "../utils/error/AppError.js";
import { env } from "../config/env.js";

// Hàm xử lý lỗi trong môi trường production
const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    // Nếu lỗi là lỗi do người dùng (ví dụ: lỗi validation)
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(err.code && { code: (err as any).code }),
      errors: err.errors,
    });
  } else {
    // Nếu lỗi là do hệ thống (ví dụ: lỗi server)
    console.error(`ERROR 💥:`, err); // Log chi tiết lỗi
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!", // Thông báo lỗi chung cho người dùng
    });
  }
};

// Hàm xử lý lỗi trong môi trường development
const sendErrorDev = (err: AppError, res: Response) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err, // Log chi tiết lỗi
    message: err.message,
    ...(err.code && { code: (err as any).code }), // Thông báo lỗi
    stack: err.stack, // Log stack trace (dành cho developer)
  });
};

// Middleware xử lý lỗi toàn cục
export default function GlobalError(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  err.statusCode = err.statusCode || 500; // Mặc định mã lỗi là 500 (server error) nếu không có mã lỗi
  err.status = err.status || "error"; // Mặc định trạng thái là "error" nếu không có

  // Kiểm tra môi trường để xác định cách xử lý lỗi
  if (env.nodeEnv === "development") {
    // Nếu là môi trường development, gửi chi tiết lỗi cho client
    sendErrorDev(err, res);
  } else if (env.nodeEnv === "production") {
    // Nếu là môi trường production, kiểm tra lỗi là ZodError hay không và gửi thông báo lỗi phù hợp
    let error = { ...err, message: err.message };

    sendErrorProd(error, res); // Gửi lỗi về client
  }
}
