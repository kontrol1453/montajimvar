import { prisma } from "./prisma";

type NotificationType =
  | "new_user"
  | "new_profile"
  | "new_review"
  | "new_message"
  | "new_payment";

interface NotifyParams {
  type: NotificationType;
  title: string;
  message?: string;
  link?: string;
}

export async function notifyAdmin(params: NotifyParams) {
  try {
    await prisma.notification.create({ data: params });
  } catch (error) {
    console.error("Bildirim oluşturma hatası:", error);
  }
}

export const NOTIFICATION_LINKS: Record<NotificationType, string> = {
  new_user: "/admin/kullanicilar",
  new_profile: "/admin/firmalar",
  new_review: "/admin/kullanicilar",
  new_message: "/admin/kullanicilar",
  new_payment: "/admin/kullanicilar",
};
