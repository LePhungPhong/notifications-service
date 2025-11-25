import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import * as service from "../services/notification.service.js";
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/error/AppError.js";
import errorCodes from "../constants/errorCodes.js";
import { sendResponse } from "../response/apiResponse.js";
import { z } from "zod";

const CreateSchema = z.object({
  userId: z.string().min(1), // receiver
  type: z.string().min(1),
  actorId: z.string().optional(),
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  title: z.string().optional(),
  message: z.string().optional(),
  meta: z.any().optional(),
  dedupe: z.boolean().optional(),
});

export const create = async (req: AuthRequest, res: Response) => {
  const actorId = (req as any).user?.sub;

  const parsed = CreateSchema.safeParse({ ...req.body, actorId });
  if (!parsed.success) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: parsed.error.flatten() });
  }
  const { dedupe = true, ...payload } = parsed.data;
  const doc = await service.createNotification(payload, dedupe);
  return sendResponse(res, StatusCodes.CREATED, "Notification created", doc);
};

export const list = async (req: AuthRequest, res: Response) => {
  const userId = (req as any).user?.sub;
  if (!userId)
    throw new AppError(
      "Missing userId",
      StatusCodes.BAD_REQUEST,
      errorCodes.VALIDATION_ERROR
    );
  const page = parseInt((req.query.page as string) || "1", 10);
  const limit = parseInt((req.query.limit as string) || "20", 10);
  const unread = (req.query.unread as string) === "true";
  const data = await service.listNotifications(userId, { page, limit, unread });
  return sendResponse(res, StatusCodes.OK, "OK", data);
};

export const readOne = async (req: AuthRequest, res: Response) => {
  const userId = (req as any).user?.sub;
  if (!userId)
    throw new AppError(
      "Unauthorized",
      StatusCodes.UNAUTHORIZED,
      errorCodes.UNAUTHORIZED
    );
  const id = req.params.id;
  const data = await service.markRead(userId, id);
  return sendResponse(res, StatusCodes.OK, "OK", data);
};

export const readAll = async (req: AuthRequest, res: Response) => {
  const userId = (req as any).user?.sub;
  if (!userId)
    throw new AppError(
      "Missing userId",
      StatusCodes.BAD_REQUEST,
      errorCodes.VALIDATION_ERROR
    );
  const data = await service.markAllRead(userId);
  return sendResponse(res, StatusCodes.OK, "OK", data);
};

export const remove = async (req: AuthRequest, res: Response) => {
  const userId = (req as any).user?.sub;
  if (!userId)
    throw new AppError(
      "Unauthorized",
      StatusCodes.UNAUTHORIZED,
      errorCodes.UNAUTHORIZED
    );
  const id = req.params.id;
  const data = await service.removeNotification(userId, id);
  return sendResponse(res, StatusCodes.OK, "OK", data);
};
