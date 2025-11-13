// src/app.ts
import express, { Application, NextFunction, Request, Response } from "express";
import notifRoutes from "./routes/notification.routes.js";
import GlobalError from "./middlewares/GlobalError.js";
import AppError from "./utils/error/AppError.js";
import { HTTP_STATUS } from "./response/httpStatusCode.js";
import { sendResponse } from "./response/apiResponse.js";

const app: Application = express();

// Core middleware
app.use(express.json());

// Healthcheck
app.get("/api/v1/notifications/health", (_req: Request, res: Response) =>
  sendResponse(res, HTTP_STATUS.OK, "OK", { status: "ok" })
);

// Routes
app.use("/api/v1/notifications", notifRoutes);

// 404
app.all("*", (req: Request, _res: Response, next: NextFunction) => {
  next(
    new AppError(`Route ${req.originalUrl} not found`, HTTP_STATUS.NOT_FOUND)
  );
});

// Global error
app.use(GlobalError as any);

export default app;
