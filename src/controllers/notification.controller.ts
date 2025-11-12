import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import * as repo from "../repositories/notification.repo.js";
import { io } from "../sockets/notification.gateway.js";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

const CreateSchema = z.object({
  userId: z.string().min(1),     // receiver
  type: z.string().min(1),
  actorId: z.string().optional(),
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  title: z.string().optional(),
  message: z.string().optional(),
  meta: z.any().optional(),
  dedupe: z.boolean().optional()
});

export const create = async (req: AuthRequest, res: Response) => {
  const parsed = CreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: parsed.error.flatten() });
  }
  const { dedupe = true, ...payload } = parsed.data;
  const doc = await repo.createNotification(payload, dedupe);
  if (doc?.userId) {
    io.to(`user:${doc.userId}`).emit("notification:new", doc);
  }
  return res.status(StatusCodes.CREATED).json(doc);
};

export const list = async (req: AuthRequest, res: Response) => {
  const userId = (req.query.userId as string) || req.userId;
  if (!userId) return res.status(StatusCodes.BAD_REQUEST).json({ error: "Missing userId" });
  const page = parseInt((req.query.page as string) || "1", 10);
  const limit = parseInt((req.query.limit as string) || "20", 10);
  const unread = (req.query.unread as string) === "true";
  const data = await repo.listNotifications(userId, { page, limit, unread });
  return res.json(data);
};

export const readOne = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
  const id = req.params.id;
  const data = await repo.markRead(userId, id);
  return res.json(data);
};

export const readAll = async (req: AuthRequest, res: Response) => {
  const userId = req.userId || (req.query.userId as string);
  if (!userId) return res.status(StatusCodes.BAD_REQUEST).json({ error: "Missing userId" });
  const data = await repo.markAllRead(userId);
  return res.json(data);
};

export const remove = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
  const id = req.params.id;
  const data = await repo.removeNotification(userId, id);
  return res.json(data);
};
