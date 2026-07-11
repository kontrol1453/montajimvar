"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  MapPin,
  CreditCard,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import NotificationBell from "./NotificationBell";

const links = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard },
  { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: Users },
  { href: "/admin/firmalar", label: "Firmalar", icon: Building2 },
  { href: "/admin/isler", label: "İşler", icon: Briefcase },
  { href: "/admin/yorumlar", label: "Yorumlar", icon: Star },
  { href: "/admin/bildirim", label: "Bildirim", icon: Bell },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: Grid3X3 },
  { href: "/admin/izinler", label: "İzinler", icon: Shield },
  { href: "/admin/sertifikalar", label: "Sertifikalar", icon: Award },
  { href: "/admin/google-firma-ekle", label: "Google Firma", icon: MapPin },
  { href: "/admin/sehir-sayfalari", label: "Şehir Sayfaları", icon: MapPin },
  { href: "/admin/abonelik-plani", label: "Abonelik", icon: CreditCard },
];

export default function AdminNav() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Sidebar header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-dark-border shrink-0">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-montaj font-bold text-sm tracking-tight">
            Montajım<span className="text-white">Var</span>
          </span>
          <span className="text-[10px] bg-montaj/15 text-montaj px-1.5 py-0.5 rounded-md font-semibold leading-none">
            Admin
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <div className="hidden lg:block">
            <NotificationBell />
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-dark-section text-sub-text transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {links.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-montaj/12 text-montaj shadow-sm"
                  : "text-sub-text hover:text-white hover:bg-dark-section"
              }`}
            >
              <link.icon
                size={18}
                className={active ? "text-montaj" : "text-sub-text"}
              />
              <span>{link.label}</span>
              {active && (
                <span className="ml-auto w-1 h-4 rounded-full bg-montaj" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-dark-border px-3 py-3 shrink-0">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sub-text hover:text-white hover:bg-dark-section transition-all"
        >
          <ExternalLink size={16} />
          Siteye Dön
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-56 bg-black border-r border-dark-border z-40">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <aside
            className="fixed left-0 top-0 bottom-0 w-64 bg-black border-r border-dark-border z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-black border-b border-dark-border flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-dark-section text-sub-text transition-colors"
          >
            <Menu size={20} />
          </button>
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-montaj font-bold text-sm tracking-tight">
              Montajım<span className="text-white">Var</span>
            </span>
            <span className="text-[10px] bg-montaj/15 text-montaj px-1.5 py-0.5 rounded-md font-semibold leading-none">
              Admin
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <Link
            href="/"
            className="text-xs text-sub-text hover:text-montaj transition flex items-center gap-1"
          >
            <ExternalLink size={12} />
          </Link>
        </div>
      </div>
    </>
  );
}
