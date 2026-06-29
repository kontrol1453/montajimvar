"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  Search,
  Briefcase,
  User,
  LogOut,
  MessageSquare,
  Heart,
  Crown,
  Shield,
  LayoutDashboard,
  Newspaper,
  ChevronDown,
} from "lucide-react";
import UnreadBadge from "./UnreadBadge";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profileOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const user = session?.user as {
    name?: string;
    email?: string;
    roles?: string[];
    id?: number;
    avatar?: string;
  } | undefined;

  return (
    <nav className="bg-white/90 backdrop-blur-xl border-b border-[var(--color-border-light)] sticky top-0 z-50">
      <div className="container-app">
        <div className="flex items-center justify-between h-[60px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span
              className="font-extrabold text-2xl tracking-tight"
              style={{ fontFamily: "'Manrope', system-ui, sans-serif", color: "var(--color-dark)" }}
            >
              Montajım<span style={{ color: "var(--color-primary)" }}>Var</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/ara"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[var(--color-dark)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-secondary)] rounded-lg transition-all"
            >
              <Search size={16} />
              Firmalar
            </Link>
            <Link
              href="/is-ver"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[var(--color-dark)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-secondary)] rounded-lg transition-all"
            >
              <Briefcase size={16} />
              İş Ver
            </Link>
            {session && (
              <Link
                href="/is-ilanlari"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[var(--color-dark)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-secondary)] rounded-lg transition-all"
              >
                İş İlanları
              </Link>
            )}
            <Link
              href="/blog"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[var(--color-dark)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-secondary)] rounded-lg transition-all"
            >
              <Newspaper size={16} />
              Blog
            </Link>

            <div className="w-px h-5 bg-[var(--color-border-light)] mx-2" />

            {session ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg hover:bg-[var(--color-surface-secondary)] transition-all"
                >
                  <span className="w-7 h-7 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center text-[var(--color-primary)] font-semibold text-xs overflow-hidden relative">
                    {user?.avatar ? (
                      <Image src={user.avatar} alt="" fill className="object-cover" unoptimized />
                    ) : (
                      user?.name?.[0]?.toUpperCase() || "?"
                    )}
                  </span>
                  <span className="text-sm font-medium text-[var(--color-text-primary)] hidden lg:inline">
                    {user?.name}
                  </span>
                  <ChevronDown size={14} className="text-[var(--color-text-tertiary)]" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-elevated border border-[var(--color-border-light)] py-1.5 animate-fade-in">
                    <div className="px-4 py-2.5 border-b border-[var(--color-border-light)]">
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                        {user?.name}
                      </p>
                      <p className="text-xs text-[var(--color-text-tertiary)]">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--color-dark)] hover:bg-[var(--color-surface-secondary)]"
                        onClick={() => setProfileOpen(false)}
                      >
                        <LayoutDashboard size={16} />
                        Panelim
                      </Link>
                      <Link
                        href="/dashboard/mesajlar"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--color-dark)] hover:bg-[var(--color-surface-secondary)] relative"
                        onClick={() => setProfileOpen(false)}
                      >
                        <MessageSquare size={16} />
                        Mesajlarım
                        <UnreadBadge />
                      </Link>
                      <Link
                        href="/islerim"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--color-dark)] hover:bg-[var(--color-surface-secondary)]"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Briefcase size={16} />
                        İşlerim
                      </Link>
                      <Link
                        href="/dashboard/favoriler"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--color-dark)] hover:bg-[var(--color-surface-secondary)]"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Heart size={16} />
                        Favorilerim
                      </Link>
                    </div>
                    <div className="border-t border-[var(--color-border-light)] pt-1">
                      <Link
                        href="/dashboard/uyelik"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--color-accent)] hover:bg-[var(--color-surface-secondary)] font-medium"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Crown size={16} />
                        Üyelik
                      </Link>
                      {user?.roles?.includes("ADMIN") && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--color-primary)] hover:bg-[var(--color-surface-secondary)] font-medium"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Shield size={16} />
                          Admin Paneli
                        </Link>
                      )}
                      <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                      >
                        <LogOut size={16} />
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/giris"
                  className="px-4 py-2 text-sm font-medium text-[var(--color-dark)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/auth/kayit"
                  className="btn-primary !py-2 !px-4 !text-sm"
                >
                  Kaydol
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menüyü aç/kapa"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--color-border-light)] bg-white px-4 py-3 space-y-1 animate-fade-in">
          <Link
            href="/ara"
            className="flex items-center gap-3 py-2.5 text-sm font-medium text-[var(--color-dark)]"
            onClick={() => setMenuOpen(false)}
          >
            <Search size={18} />
            Firmalar
          </Link>
<Link
                href="/islerim"
                className="flex items-center gap-3 py-2.5 text-sm font-medium text-[var(--color-dark)]"
                onClick={() => setMenuOpen(false)}
              >
            <Briefcase size={18} />
            İş Ver
          </Link>
          <Link
            href="/blog"
            className="flex items-center gap-3 py-2.5 text-sm font-medium text-[var(--color-dark)]"
            onClick={() => setMenuOpen(false)}
          >
            <Newspaper size={18} />
            Blog
          </Link>
          {session ? (
            <>
              <hr className="border-[var(--color-border-light)] my-1" />
              <Link
                href="/is-ilanlari"
                className="flex items-center gap-3 py-2.5 text-sm font-medium text-[var(--color-dark)]"
                onClick={() => setMenuOpen(false)}
              >
                <Briefcase size={18} />
                İş İlanları
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 py-2.5 text-sm font-medium text-[var(--color-dark)]"
                onClick={() => setMenuOpen(false)}
              >
                <LayoutDashboard size={18} />
                Panelim
              </Link>
<Link
                href="/dashboard/mesajlar"
                className="flex items-center gap-3 py-2.5 text-sm font-medium text-[var(--color-dark)] relative"
                onClick={() => setMenuOpen(false)}
              >
                <MessageSquare size={18} />
                Mesajlarım
                <UnreadBadge />
              </Link>
              <Link
                href="/dashboard/favoriler"
                className="flex items-center gap-3 py-2.5 text-sm font-medium text-[var(--color-dark)]"
                onClick={() => setMenuOpen(false)}
              >
                <Heart size={18} />
                Favorilerim
              </Link>
              <Link
                href="/dashboard/uyelik"
                className="flex items-center gap-3 py-2.5 text-sm font-medium text-[var(--color-accent)]"
                onClick={() => setMenuOpen(false)}
              >
                <Crown size={18} />
                Üyelik
              </Link>
              {user?.roles?.includes("ADMIN") && (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 py-2.5 text-sm font-medium text-[var(--color-primary)]"
                  onClick={() => setMenuOpen(false)}
                >
                  <Shield size={18} />
                  Admin Paneli
                </Link>
              )}
              <button
                onClick={() => { setMenuOpen(false); signOut(); }}
                className="flex items-center gap-3 w-full py-2.5 text-sm font-medium text-red-500"
              >
                <LogOut size={18} />
                Çıkış Yap
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-3">
              <Link
                href="/auth/giris"
                className="block text-center py-2.5 text-sm font-medium text-[var(--color-dark)] border border-[var(--color-border-default)] rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                Giriş Yap
              </Link>
              <Link
                href="/auth/kayit"
                className="btn-primary !w-full text-center"
                onClick={() => setMenuOpen(false)}
              >
                Kaydol
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
