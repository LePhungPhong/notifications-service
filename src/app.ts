// src/app.ts
import express, { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import notifRoutes from "./routes/notification.routes";
import GlobalError from "./middlewares/GlobalError";
import AppError from "./utils/error/AppError";
import { HTTP_STATUS } from "./response/httpStatusCode";
import { sendResponse } from "./response/apiResponse";
import helmet from "helmet";

const app: Application = express();

app.use((_, __, next) => {
  console.log("run");
  next();
});

// Core middleware
app.use(helmet()); // Bảo mật HTTP headers
app.use(cookieParser()); // Parse cookie
app.use(express.json());

// Healthcheck
app.get("/api/v1/notifications/health", (_req: Request, res: Response) =>
  sendResponse(res, HTTP_STATUS.OK, "OK", { status: "ok" })
);

// Routes
app.use("/api/v1/notifications", notifRoutes);

// 404
app.all("*path", (req: Request, _res: Response, next: NextFunction) => {
  next(
    new AppError(`Route ${req.originalUrl} not found`, HTTP_STATUS.NOT_FOUND)
  );
});

// Global error
app.use(GlobalError as any);

export default app;
