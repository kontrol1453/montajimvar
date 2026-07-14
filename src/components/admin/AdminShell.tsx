"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "./Sidebar/AdminSidebar";
import MobileSidebarDrawer from "./Sidebar/MobileSidebarDrawer";
import AdminHeader from "./Header/AdminHeader";
import AdminSearchModal from "./AdminSearchModal";

const COLLAPSED_KEY = "admin-sidebar-collapsed";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
    function handleSearchClick(e: MouseEvent) {
      const target = e.target as Element | null;
      if (!target) return;
      if (target.closest("[data-admin-search-toggle]")) setSearchOpen(true);
    }
    document.addEventListener("click", handleSearchClick);
    return () => document.removeEventListener("click", handleSearchClick);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const paddingLeft = collapsed
    ? "var(--admin-sidebar-width-collapsed)"
    : "var(--admin-sidebar-width)";

  return (
    <div className="h-dvh bg-[var(--color-surface-secondary)] text-zinc-900 overflow-hidden">
      <a
        href="#admin-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-md focus:shadow-lg focus:text-sm focus:font-medium"
      >
        İçeriğe geç
      </a>
      <div className="hidden lg:block fixed inset-y-0 left-0" style={{ zIndex: "var(--admin-z-sidebar)" }}>
        <AdminSidebar variant={collapsed ? "collapsed" : "expanded"} />
      </div>

      <MobileSidebarDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <AdminSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
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
        <main id="admin-main-content" className="flex-1 min-w-0 overflow-y-auto" tabIndex={-1}>{children}</main>
      </div>
    </div>
  );
}
