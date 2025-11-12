import * as repo from "../repositories/notification.repo.js";
import { INotification } from "../models/Notification.js";

export const createNotification = async (
  payload: Partial<INotification>,
  dedupe: boolean = true
) => {
  return repo.createNotification(payload, dedupe);
};

export const listNotifications = async (
  userId: string,
  opts: { page?: number; limit?: number; unread?: boolean } = {}
) => {
  return repo.listNotifications(userId, opts);
};
export const markRead = async (userId: string, id: string) => {
  return repo.markRead(userId, id);
};

export const markAllRead = async (userId: string) => {
  return repo.markAllRead(userId);
};

export const removeNotification = async (userId: string, id: string) => {
  return repo.removeNotification(userId, id);
};
