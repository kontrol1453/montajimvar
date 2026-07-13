"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "./Sidebar/AdminSidebar";
import MobileSidebarDrawer from "./Sidebar/MobileSidebarDrawer";
import AdminHeader from "./Header/AdminHeader";

const COLLAPSED_KEY = "admin-sidebar-collapsed";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(COLLAPSED_KEY);
      if (raw === "1") setCollapsed(true);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(COLLAPSED_KEY, collapsed ? "1" : "0");
    } catch {}
  }, [collapsed]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Element | null;
      if (!target) return;
      const btn = target.closest("[data-admin-mobile-toggle]") as HTMLElement | null;
      if (btn) setDrawerOpen(true);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    const prevHeight = document.body.style.height;
    document.body.style.overflow = "hidden";
    document.body.style.height = "100dvh";
    return () => {
      document.body.style.overflow = prev;
      document.body.style.height = prevHeight;
    };
  }, []);

  const paddingLeft = collapsed
    ? "var(--admin-sidebar-width-collapsed)"
    : "var(--admin-sidebar-width)";

  return (
    <div className="h-dvh bg-[var(--color-surface-secondary)] text-zinc-900 overflow-hidden">
      <div className="hidden lg:block fixed inset-y-0 left-0 z-40">
        <AdminSidebar variant={collapsed ? "collapsed" : "expanded"} />
      </div>

      <MobileSidebarDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <div
        className="flex flex-col h-full transition-[padding-left] duration-200 ease-out"
        style={{ paddingLeft }}
        data-collapsed={collapsed ? "1" : "0"}
      >
        <AdminHeader
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((v) => !v)}
        />
        <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
