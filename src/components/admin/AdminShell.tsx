"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "./Sidebar/AdminSidebar";
import MobileSidebarDrawer from "./Sidebar/MobileSidebarDrawer";
import AdminHeader from "./Header/AdminHeader";

const COLLAPSED_KEY = "admin-sidebar-collapsed";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Hydrate collapsed state from localStorage (desktop sidebar only)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(COLLAPSED_KEY);
      if (raw === "1") setCollapsed(true);
    } catch {
      /* ignore */
    }
  }, []);

  // Persist collapsed state
  useEffect(() => {
    try {
      window.localStorage.setItem(COLLAPSED_KEY, collapsed ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  // Wire up [data-admin-mobile-toggle] triggers rendered inside AdminHeader.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Element | null;
      if (!target) return;
      const btn = target.closest("[data-admin-mobile-toggle]") as
        | HTMLElement
        | null;
      if (btn) setDrawerOpen(true);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const mainPaddingLeft =
    "var(--admin-sidebar-width)";

  return (
    <div className="min-h-screen bg-[var(--color-surface-secondary)] text-zinc-900">
      {/* Desktop sidebar — fixed to viewport left edge, lg+ visible */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-40">
        <AdminSidebar variant={collapsed ? "collapsed" : "expanded"} />
      </div>

      {/* Mobile drawer overlay */}
      <MobileSidebarDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Main column — header is sticky inside, content scrolls naturally */}
      <div
        className="flex flex-col min-h-screen transition-[padding-left] duration-200 ease-out"
        style={{
          paddingLeft:
            typeof window === "undefined"
              ? "var(--admin-sidebar-width)"
              : collapsed
                ? "var(--admin-sidebar-width-collapsed)"
                : "var(--admin-sidebar-width)",
        }}
        data-collapsed={collapsed ? "1" : "0"}
        suppressHydrationWarning
      >
        <AdminHeader
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((v) => !v)}
        />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
