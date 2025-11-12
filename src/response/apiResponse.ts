import { Response } from "express";

export function sendResponse<T>(
  res: Response,
  status: number,
  message: string,
  data?: T
) {
  res.status(status).json({
    status,
    success: status < 400,
    message,
    ...(data && { data }),
  });
}
