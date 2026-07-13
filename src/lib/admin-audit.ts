import { prisma } from "./prisma";

type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "approve"
  | "reject"
  | "suspend"
  | "role_change"
  | "premium_change"
  | "verify"
  | "unverify"
  | "resolve"
  | "cancel"
  | "feature"
  | "unfeature";

type AuditEntity =
  | "user"
  | "profile"
  | "job"
  | "offer"
  | "payment"
  | "dispute"
  | "certificate"
  | "subscription_plan"
  | "role_permission"
  | "notification";

interface AuditParams {
  adminId: number;
  action: AuditAction;
  entity: AuditEntity;
  entityId: number;
  details?: Record<string, unknown>;
  ip?: string;
}

export async function logAdminAction(params: AuditParams) {
  try {
    await prisma.adminAuditLog.create({
      data: {
        adminId: params.adminId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        details: params.details ? JSON.stringify(params.details) : null,
        ip: params.ip ?? null,
      },
    });
  } catch (error) {
    console.error("AdminAuditLog error:", error);
  }
}

export function extractAdminId(session: { user?: Record<string, unknown> } | null): number {
  return (session?.user?.id as number) ?? 0;
}
