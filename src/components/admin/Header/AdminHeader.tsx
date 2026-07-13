"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import NotificationBell from "@/app/admin/NotificationBell";
import Breadcrumb from "./Breadcrumb";
import { MobileMenuTrigger, CollapseToggle } from "../Sidebar/SidebarToggle";

interface AdminHeaderProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export default function AdminHeader({ collapsed, onToggleCollapsed }: AdminHeaderProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const user = session?.user as
    | { name?: string; email?: string; avatar?: string }
    | undefined;
  const initial = (user?.name?.[0] ?? user?.email?.[0] ?? "A").toUpperCase();

  return (
    <header
      className="sticky top-0 z-30 h-14 bg-[var(--admin-surface)] border-b border-[var(--admin-border)] flex items-center px-4 sm:px-6 gap-3 admin-header"
    >
      {/* Mobile drawer trigger */}
      <div className="lg:hidden">
        <MobileMenuTrigger />
      </div>

      {/* Desktop collapse toggle */}
      <div className="hidden lg:block">
        <CollapseToggle collapsed={collapsed} onToggle={onToggleCollapsed} />
      </div>

      {/* Breadcrumb — desktop only on right side, mobile takes over */}
      <div className="flex-1 min-w-0 hidden sm:block">
        <Breadcrumb />
      </div>
      <div className="flex-1 sm:hidden">
        <span className="text-sm font-semibold text-[var(--admin-text-primary)] truncate block">
          Admin
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1 shrink-0">
        <NotificationBell />
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={open}
            className="flex items-center gap-2 pl-2 pr-2 h-9 rounded-md text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-muted)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            <span
              className="w-7 h-7 rounded-full bg-[var(--admin-surface-muted)] text-[var(--admin-text-secondary)] flex items-center justify-center text-xs font-semibold overflow-hidden relative"
              aria-hidden
            >
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                initial
              )}
            </span>
            <span className="text-sm font-medium hidden md:inline truncate max-w-[160px]">
              {user?.name ?? user?.email ?? "Admin"}
            </span>
            <ChevronDown
              size={14}
              className="text-[var(--admin-text-muted)]"
              aria-hidden
            />
          </button>

          {open && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 bg-[var(--admin-surface)] rounded-lg shadow-lg border border-[var(--admin-border)] py-1.5 z-40"
            >
              {(user?.name || user?.email) && (
                <div className="px-4 py-2 border-b border-[var(--admin-border)]">
                  {user?.name && (
                    <p className="text-sm font-semibold text-[var(--admin-text-primary)] truncate">
                      {user.name}
                    </p>
                  )}
                  {user?.email && (
                    <p className="text-xs text-[var(--admin-text-muted)] truncate">
                      {user.email}
                    </p>
                  )}
                </div>
              )}
              <div className="py-1">
                <Link
                  href="/dashboard"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-muted)]"
                >
                  <LayoutDashboard size={16} aria-hidden />
                  Kullanıcı Paneli
                </Link>
                <Link
                  href="/dashboard/profil"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-muted)]"
                >
                  <UserIcon size={16} aria-hidden />
                  Profilim
                </Link>
              </div>
              <div className="border-t border-[var(--admin-border)] pt-1">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} aria-hidden />
                  Çıkış Yap
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
