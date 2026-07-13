import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Star,
  Bell,
  FileText,
  Grid3X3,
  Shield,
  Award,
  AlertTriangle,
  MapPin,
  CreditCard,
  BarChart3,
} from "lucide-react";
import type { ComponentType } from "react";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number | string; className?: string }>;
  /** Optional badge — e.g. "Yeni" or count. Plain text, no emojis. */
  badge?: string;
  /** Optional description shown in tooltip when sidebar is collapsed. */
  description?: string;
}

export interface AdminNavGroup {
  id: string;
  label: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    id: "general",
    label: "Genel",
    items: [
      {
        href: "/admin",
        label: "Panel",
        icon: LayoutDashboard,
        description: "Genel istatistikler ve hızlı işlemler",
      },
    ],
  },
  {
    id: "management",
    label: "Yönetim",
    items: [
      {
        href: "/admin/kullanicilar",
        label: "Kullanıcılar",
        icon: Users,
        description: "Sistemdeki kullanıcı hesapları",
      },
      {
        href: "/admin/firmalar",
        label: "Firmalar",
        icon: Building2,
        description: "Firma profilleri ve doğrulama",
      },
      {
        href: "/admin/isler",
        label: "İşler",
        icon: Briefcase,
        description: "Tüm iş ilanları ve durum takibi",
      },
      {
        href: "/admin/yorumlar",
        label: "Yorumlar",
        icon: Star,
        description: "Firma ve iş yorumları denetimi",
      },
    ],
  },
  {
    id: "content",
    label: "İçerik",
    items: [
      {
        href: "/admin/blog",
        label: "Blog",
        icon: FileText,
        description: "Blog yazıları ve yayın yönetimi",
      },
      {
        href: "/admin/kategoriler",
        label: "Kategoriler",
        icon: Grid3X3,
        description: "Hizmet kategori ağacı",
      },
      {
        href: "/admin/sehir-sayfalari",
        label: "Şehir Sayfaları",
        icon: MapPin,
        description: "Şehir landing page içerikleri",
      },
      {
        href: "/admin/google-firma-ekle",
        label: "Google Firma",
        icon: MapPin,
        description: "Google Business entegrasyonu",
      },
    ],
  },
  {
    id: "operations",
    label: "Operasyon",
    items: [
      {
        href: "/admin/bildirim",
        label: "Bildirimler",
        icon: Bell,
        description: "Push notification ve admin bildirimleri",
      },
      {
        href: "/admin/sertifikalar",
        label: "Sertifikalar",
        icon: Award,
        description: "Usta sertifika yönetimi",
      },
      {
        href: "/admin/anlasmazliklar",
        label: "Anlaşmazlıklar",
        icon: AlertTriangle,
        description: "İş anlaşmazlık çözümleri",
      },
    ],
  },
  {
    id: "system",
    label: "Sistem",
    items: [
      {
        href: "/admin/izinler",
        label: "İzinler",
        icon: Shield,
        description: "Rollerin sayfa izinleri",
      },
      {
        href: "/admin/abonelik-plani",
        label: "Abonelik",
        icon: CreditCard,
        description: "Premium abonelik planları",
      },
      {
        href: "/admin/crm",
        label: "CRM",
        icon: BarChart3,
        description: "Müşteri ilişkileri ve analiz",
      },
    ],
  },
];

export function findItemByPath(pathname: string | null): AdminNavItem | undefined {
  if (!pathname) return undefined;
  for (const group of ADMIN_NAV_GROUPS) {
    for (const item of group.items) {
      if (item.href === "/admin") {
        if (pathname === "/admin") return item;
        continue;
      }
      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
        return item;
      }
    }
  }
  return undefined;
}

export function findGroupByPath(pathname: string | null): AdminNavGroup | undefined {
  const item = findItemByPath(pathname);
  if (!item) return undefined;
  return ADMIN_NAV_GROUPS.find((g) => g.items.some((i) => i.href === item.href));
}

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

export function buildBreadcrumb(pathname: string | null): BreadcrumbSegment[] {
  if (!pathname) return [];
  if (pathname === "/admin") {
    return [{ label: "Admin" }, { label: "Panel" }];
  }
  const segments: BreadcrumbSegment[] = [{ label: "Admin", href: "/admin" }];
  const rest = pathname.replace(/^\/admin\/?/, "");
  if (!rest) return segments;
  const parts = rest.split("/").filter(Boolean);
  let acc = "/admin";
  for (const part of parts) {
    acc += `/${part}`;
    const item = findItemByPath(acc);
    segments.push({
      label: item?.label ?? humanizeSlug(part),
      href: acc === pathname ? undefined : acc,
    });
  }
  return segments;
}

function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
    .join(" ");
}
