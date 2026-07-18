import { prisma } from "./prisma";

type ActivityType =
  | "note"
  | "call"
  | "email"
  | "message"
  | "status_change"
  | "task_update"
  | "payment"
  | "review"
  | "file_upload"
  | "meeting";

interface ActivityParams {
  type: ActivityType;
  subject: string;
  description?: string;
  entityType: string;
  entityId: number;
  ownerId?: number;
  metadata?: Record<string, unknown>;
}

export async function logActivity(params: ActivityParams) {
  try {
    if ("activity" in prisma) {
      await (prisma as any).activity.create({ data: params });
    }
  } catch (error) {
    console.error("Activity log error:", error);
  }
}
