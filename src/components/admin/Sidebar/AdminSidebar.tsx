"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink } from "lucide-react";
import {
  ADMIN_NAV_GROUPS,
  type AdminNavGroup,
  type AdminNavItem,
} from "@/lib/admin-nav";
import { cn } from "@/lib/utils";
import NotificationBell from "@/app/admin/NotificationBell";

interface AdminSidebarProps {
  /**
   * "collapsed" → compact vertical sidebar (icons only, ~5rem wide)
   * "expanded" → normal width sidebar (~16rem)
   * "drawer"   → mobile drawer variant — always expanded width, slides over content
   */
  variant: "collapsed" | "expanded" | "drawer";
  /** Optional — close callbacks for drawer variant */
  onNavigate?: () => void;
}

function isItemActive(pathname: string | null, item: AdminNavItem): boolean {
  if (!pathname) return false;
  if (item.href === "/admin") return pathname === "/admin";
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function SidebarBrand({ collapsed }: { collapsed: boolean }) {
  return (
    <Link
      href="/admin"
      className={cn(
        "flex items-center gap-2 min-w-0",
        collapsed ? "justify-center" : "px-1"
      )}
      aria-label="Admin ana sayfa"
    >
      <span className="text-montaj font-extrabold text-base tracking-tight whitespace-nowrap">
        Montajım<span className="text-white">Var</span>
      </span>
      {!collapsed && (
        <span className="text-[10px] bg-montaj/15 text-montaj px-1.5 py-0.5 rounded-md font-semibold leading-none uppercase tracking-wide">
          Admin
        </span>
      )}
    </Link>
  );
}

function NavLink({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: AdminNavItem;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const label = item.label;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? (item.description || label) : undefined}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-md text-sm font-medium transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-montaj focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        collapsed
          ? "h-10 w-10 justify-center [&:hover_.tooltip-label]:opacity-100 [&:hover_.tooltip-label]:translate-x-0"
          : "h-10 px-3",
        active
          ? "bg-montaj/15 text-montaj"
          : "text-zinc-300 hover:text-white hover:bg-white/5"
      )}
    >
      <Icon
        size={18}
        className={cn("shrink-0", active ? "text-montaj" : "text-zinc-400 group-hover:text-white")}
      />
      {collapsed && (
        <span
          className="tooltip-label pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2 -translate-x-1
                     whitespace-nowrap rounded-md bg-zinc-800 px-2 py-1 text-xs text-white shadow-lg
                     opacity-0 transition-all duration-150 z-50"
          role="tooltip"
        >
          {label}
        </span>
      )}
      {!collapsed && (
        <>
          <span className="truncate flex-1">{label}</span>
          {active && (
            <span className="ml-auto w-1 h-4 rounded-full bg-montaj shrink-0" aria-hidden />
          )}
        </>
      )}
    </Link>
  );
}

function NavGroup({
  group,
  pathname,
  collapsed,
  onNavigate,
}: {
  group: AdminNavGroup;
  pathname: string | null;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="space-y-1">
      {!collapsed && (
        <div
          className="px-3 pt-3 pb-1 text-[10px] uppercase tracking-wider font-semibold text-zinc-500 select-none"
          aria-hidden
        >
          {group.label}
        </div>
      )}
      <div className="space-y-0.5">
        {group.items.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isItemActive(pathname, item)}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}

export default function AdminSidebar({ variant, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();
  const collapsed = variant === "collapsed";

  const widthClass =
    variant === "drawer"
      ? "w-[var(--admin-sidebar-width-mobile)]"
      : collapsed
        ? "w-[var(--admin-sidebar-width-collapsed)]"
        : "w-[var(--admin-sidebar-width)]";

  const aside = (
    <aside
      className={cn(
        "flex flex-col bg-black text-white border-r border-white/10 h-full",
        widthClass,
        "transition-[width] duration-200 ease-out"
      )}
      aria-label="Admin gezinme menüsü"
    >
      {/* Brand */}
      <div
        className={cn(
          "flex items-center h-14 shrink-0 border-b border-white/10",
          collapsed ? "justify-center px-0" : "justify-between px-4"
        )}
      >
        <SidebarBrand collapsed={collapsed} />
        {!collapsed && variant === "expanded" && (
          <div className="hidden md:block">
            <NotificationBell />
          </div>
        )}
        {!collapsed && variant === "drawer" && (
          <div className="md:hidden">
            <NotificationBell />
          </div>
        )}
      </div>

      {/* Scroll region — document scroll is primary; this only kicks in on very tall menus */}
      <nav
        className={cn(
          "flex-1 py-3 space-y-3",
          collapsed ? "px-2 overflow-y-auto" : "px-3 overflow-y-auto"
        )}
        aria-label="Admin nav"
      >
        {ADMIN_NAV_GROUPS.map((group) => (
          <NavGroup
            key={group.id}
            group={group}
            pathname={pathname}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {/* Bottom: siteye don */}
      <div className="border-t border-white/10 px-3 py-3 shrink-0">
        <Link
          href="/"
          title={collapsed ? "Siteye Dön" : undefined}
          aria-label="Siteye Dön"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-md text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-montaj",
            collapsed
              ? "h-10 w-10 mx-auto justify-center"
              : "h-10 px-3"
          )}
        >
          <ExternalLink size={16} className="shrink-0" />
          {!collapsed && <span>Siteye Dön</span>}
        </Link>
      </div>
    </aside>
  );

  return aside;
}
