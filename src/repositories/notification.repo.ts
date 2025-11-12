import { FilterQuery } from "mongoose";
import { Notification, INotification } from "../models/Notification.js";

export const createNotification = async (payload: Partial<INotification>, dedupe = true) => {
  if (dedupe) {
    try {
      // try unique upsert on (userId,type,actorId,entityId)
      const doc = await Notification.findOneAndUpdate(
        {
          userId: payload.userId,
          type: payload.type,
          actorId: payload.actorId ?? null,
          entityId: payload.entityId ?? null,
        } as FilterQuery<INotification>,
        { $setOnInsert: payload },
        { new: true, upsert: true }
      ).lean();
      return doc;
    } catch (e) {
      // If unique index violation, just fetch existing
      const doc = await Notification.findOne({
        userId: payload.userId,
        type: payload.type,
        actorId: payload.actorId ?? null,
        entityId: payload.entityId ?? null,
      }).lean();
      return doc;
    }
  }
  const doc = await Notification.create(payload);
  return doc.toObject();
};

export const listNotifications = async (userId: string, opts: { page?: number; limit?: number; unread?: boolean } = {}) => {
  const { page = 1, limit = 20, unread = false } = opts;
  const q: FilterQuery<INotification> = { userId };
  if (unread) q.isRead = false;
  const cursor = Notification.find(q).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
  const [items, total] = await Promise.all([cursor.lean(), Notification.countDocuments(q)]);
  return { items, pagination: { page, limit, total } };
};

export const markRead = async (userId: string, id: string) => {
  const doc = await Notification.findOneAndUpdate(
    { _id: id, userId },
    { $set: { isRead: true, readAt: new Date() } },
    { new: true }
  ).lean();
  return doc;
};

export const markAllRead = async (userId: string) => {
  const res = await Notification.updateMany({ userId, isRead: false }, { $set: { isRead: true, readAt: new Date() } });
  return { matched: res.matchedCount, modified: res.modifiedCount };
};

export const removeNotification = async (userId: string, id: string) => {
  const res = await Notification.deleteOne({ _id: id, userId });
  return { deleted: res.deletedCount };
};
