import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
  userId: string;        // người nhận
  type: string;          // like | comment | follow | system | ...
  actorId?: string;      // người tạo hành động
  entityType?: string;   // post | comment | user | ...
  entityId?: string;     // id thực thể
  title?: string;
  message?: string;
  isRead: boolean;
  readAt?: Date | null;
  meta?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: true, index: true },
    type: { type: String, required: true, index: true },
    actorId: { type: String, default: null, index: true },
    entityType: { type: String, default: null },
    entityId: { type: String, default: null, index: true },
    title: { type: String, default: "" },
    message: { type: String, default: "" },
    isRead: { type: Boolean, default: false, index: true },
    readAt: { type: Date, default: null },
    meta: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Dedupe: (userId, type, actorId, entityId)
NotificationSchema.index(
  { userId: 1, type: 1, actorId: 1, entityId: 1 },
  { unique: true, sparse: true, name: "unique_dedupe_key" }
);

export const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
