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
  MapPin,
  CreditCard,
  Menu,
  X,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";

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
  { href: "/admin/google-firma-ekle", label: "Google Firma", icon: MapPin },
  { href: "/admin/abonelik-plani", label: "Abonelik", icon: CreditCard },
];

export default function AdminNav() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-14 border-b border-dark-border shrink-0">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-montaj font-bold text-sm">Montajım Var</span>
          <span className="text-[10px] bg-montaj/20 text-montaj px-1.5 py-0.5 rounded-full">
            Admin
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1 rounded-lg hover:bg-dark-section text-sub-text"
        >
          <X size={18} />
        </button>
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
                  ? "bg-montaj/15 text-montaj"
                  : "text-sub-text hover:text-white hover:bg-dark-section"
              }`}
            >
              <link.icon size={18} className={active ? "text-montaj" : ""} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-dark-border px-3 py-3 space-y-2 shrink-0">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sub-text hover:text-white hover:bg-dark-section transition-all"
        >
          <ExternalLink size={18} />
          Siteye Dön
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-56 bg-black border-r border-dark-border z-40">
        {sidebar}
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-50"
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            className="fixed left-0 top-0 bottom-0 w-64 bg-black border-r border-dark-border z-50 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebar}
          </aside>
        </div>
      )}

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-black border-b border-dark-border flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-dark-section text-sub-text"
          >
            <Menu size={20} />
          </button>
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-montaj font-bold text-sm">Montajım Var</span>
            <span className="text-[10px] bg-montaj/20 text-montaj px-1.5 py-0.5 rounded-full">
              Admin
            </span>
          </Link>
        </div>
        <Link
          href="/"
          className="text-xs text-sub-text hover:text-montaj transition flex items-center gap-1"
        >
          <ExternalLink size={12} />
          Site
        </Link>
      </div>
    </>
  );
}
