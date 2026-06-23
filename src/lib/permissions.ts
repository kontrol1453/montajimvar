import { prisma } from "./prisma";

export async function hasPermission(
  role: string,
  feature: string
): Promise<boolean> {
  try {
    const perm = await prisma.rolePermission.findUnique({
      where: { role_feature: { role, feature } },
    });

    return perm?.enabled ?? true; // Default to true if not set
  } catch {
    return true; // Default to true on error
  }
}

export const FEATURES = {
  VIEW_PROFILES: "view_profiles",
  SEND_MESSAGE: "send_message",
  RECEIVE_MESSAGE: "receive_message",
  CREATE_COMPANY_PROFILE: "create_company_profile",
  LEAVE_REVIEW: "leave_review",
  ADD_FAVORITE: "add_favorite",
  UPLOAD_PHOTOS: "upload_photos",
  VIEW_CONTACT_INFO: "view_contact_info",
  VIEW_DASHBOARD: "view_dashboard",
} as const;

export const FEATURE_LABELS: Record<string, string> = {
  view_profiles: "Firma Profillerini Görme",
  send_message: "Mesaj Gönderme",
  receive_message: "Mesaj Alma",
  create_company_profile: "Firma Profili Oluşturma",
  leave_review: "Yorum Bırakma",
  add_favorite: "Favorilere Ekleme",
  upload_photos: "Fotoğraf Yükleme",
  view_contact_info: "İletişim Bilgilerini Görme",
  view_dashboard: "Paneli Görüntüleme",
};

