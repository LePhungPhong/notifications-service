import jwt from "jsonwebtoken";
import CatchAsync from "../utils/error/CatchAsync";

/**
 * Middleware xác thực JWT từ header Authorization
 */
export const verifyToken = CatchAsync(async (req, res, next) => {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) throw new Error("Chưa cấu hình JWT_SECRET");

  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Token không hợp lệ (thiếu Bearer)" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret);
    (req as any).user = decoded;

    console.log(decoded);

    next();
  } catch (err: any) {
    const message =
      err.name === "TokenExpiredError"
        ? "Token đã hết hạn"
        : "Token không hợp lệ";

    return res.status(403).json({ message });
  }
});
