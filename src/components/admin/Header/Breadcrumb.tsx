"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
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
  Home,
} from "lucide-react";
import { findItemByPath } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

export default function Breadcrumb() {
  const pathname = usePathname();
  if (!pathname || !pathname.startsWith("/admin")) return null;

  // Always start with Home (admin root)
  const segments: { label: string; href?: string; icon?: typeof Home }[] = [
    {
      label: "Admin",
      href: "/admin",
      icon: LayoutDashboard,
    },
  ];

  if (pathname === "/admin") {
    segments[0].href = undefined;
    segments[0].label = "Panel";
  } else {
    const rest = pathname.replace(/^\/admin\/?/, "");
    if (rest) {
      const item = findItemByPath(pathname);
      if (item) {
        segments.push({ label: item.label });
      } else {
        // nested (rare for current admin structure, but safe)
        const parts = rest.split("/").filter(Boolean);
        let acc = "/admin";
        for (const part of parts) {
          acc += `/${part}`;
          segments.push({
            label: humanizeSlug(part),
            href: acc === pathname ? undefined : acc,
          });
        }
      }
    }
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center text-sm min-w-0"
    >
      <ol className="flex items-center gap-1.5 min-w-0 flex-wrap">
        {segments.map((segment, i) => {
          const last = i === segments.length - 1;
          const Icon = segment.icon;
          return (
            <li
              key={`${segment.label}-${i}`}
              className="flex items-center gap-1.5 min-w-0"
            >
              {i > 0 && (
                <span aria-hidden className="text-[var(--admin-text-muted)] select-none">
                  /
                </span>
              )}
              {segment.href && !last ? (
                <Link
                  href={segment.href}
                  className="flex items-center gap-1.5 px-1 py-0.5 rounded text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)] hover:bg-[var(--admin-surface-muted)] transition-colors truncate"
                >
                  {Icon && <Icon size={14} className="shrink-0" aria-hidden />}
                  <span className="truncate">{segment.label}</span>
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-1.5 px-1 py-0.5 truncate",
                    last
                      ? "text-[var(--admin-text-primary)] font-semibold"
                      : "text-[var(--admin-text-secondary)]"
                  )}
                >
                  {Icon && <Icon size={14} className="shrink-0" aria-hidden />}
                  <span className="truncate">{segment.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
    .join(" ");
}
