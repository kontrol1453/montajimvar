"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  Briefcase,
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

const NAV_LINKS = [
  { label: "Hizmetler", href: "/ara" },
  { label: "Nasıl Çalışır?", href: "/#nasil-calisir" },
  { label: "Kurumsal", href: "/kurumsal" },
  { label: "Montaj Ekipleri", href: "/ekip-ol" },
  { label: "Blog", href: "/blog", icon: Newspaper },
] as const;

function isActive(href: string, pathname: string): boolean {
  if (href.startsWith("/#")) return false;
  if (href === "/ara" && pathname.startsWith("/ara")) return true;
  if (href === "/blog" && pathname.startsWith("/blog")) return true;
  return pathname === href;
}

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

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

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setProfileOpen(false);
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const user = session?.user as {
    name?: string;
    email?: string;
    roles?: string[];
    id?: number;
    avatar?: string;
  } | undefined;

  return (
    <header>
      <a href="#main-content" className="skip-link">
        Ana içeriğe geç
      </a>
      <nav
        className="bg-white/90 backdrop-blur-xl border-b border-[var(--color-border-light)] sticky top-0 z-50"
        aria-label="Ana navigasyon"
      >
        <div className="container-app">
          <div className="flex items-center justify-between h-[60px]">
            <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Ana sayfa">
              <span
                className="font-extrabold text-2xl tracking-tight"
                style={{ fontFamily: "'Manrope', system-ui, sans-serif", color: "var(--color-dark)" }}
              >
                Montajım<span style={{ color: "var(--color-primary)" }}>Var</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href, pathname);
                const Icon = "icon" in link ? link.icon : null;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                      active
                        ? "text-[var(--color-primary)] bg-[var(--color-primary)]/5"
                        : "text-[var(--color-dark)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-secondary)]"
                    }`}
                  >
                    {Icon && <Icon size={16} />}
                    {link.label}
                  </Link>
                );
              })}

              <div className="w-px h-5 bg-[var(--color-border-light)] mx-2" role="none" />

              {session ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    aria-expanded={profileOpen}
                    aria-haspopup="true"
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
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-elevated border border-[var(--color-border-light)] py-1.5 animate-fade-in"
                      role="menu"
                    >
                      <div className="px-4 py-2.5 border-b border-[var(--color-border-light)]">
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                          {user?.name}
                        </p>
                        <p className="text-xs text-[var(--color-text-tertiary)]">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          role="menuitem"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--color-dark)] hover:bg-[var(--color-surface-secondary)]"
                          onClick={() => setProfileOpen(false)}
                        >
                          <LayoutDashboard size={16} />
                          Panelim
                        </Link>
                        <Link
                          href="/dashboard/mesajlar"
                          role="menuitem"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--color-dark)] hover:bg-[var(--color-surface-secondary)] relative"
                          onClick={() => setProfileOpen(false)}
                        >
                          <MessageSquare size={16} />
                          Mesajlarım
                          <UnreadBadge />
                        </Link>
                        <Link
                          href="/islerim"
                          role="menuitem"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--color-dark)] hover:bg-[var(--color-surface-secondary)]"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Briefcase size={16} />
                          İşlerim
                        </Link>
                        <Link
                          href="/dashboard/favoriler"
                          role="menuitem"
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
                          role="menuitem"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--color-accent)] hover:bg-[var(--color-surface-secondary)] font-medium"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Crown size={16} />
                          Üyelik
                        </Link>
                        {user?.roles?.includes("ADMIN") && (
                          <Link
                            href="/admin"
                            role="menuitem"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--color-primary)] hover:bg-[var(--color-surface-secondary)] font-medium"
                            onClick={() => setProfileOpen(false)}
                          >
                            <Shield size={16} />
                            Admin Paneli
                          </Link>
                        )}
                        <button
                          onClick={() => signOut()}
                          role="menuitem"
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
                    href="/is-ver"
                    className="btn-primary !py-2 !px-4 !text-sm"
                  >
                    İş Oluştur
                  </Link>
                </div>
              )}
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            id="mobile-menu"
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobil navigasyon menüsü"
            className="md:hidden border-t border-[var(--color-border-light)] bg-white px-4 py-3 space-y-1 animate-fade-in"
          >
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href, pathname);
              const Icon = "icon" in link ? link.icon : null;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 py-2.5 text-sm font-medium ${
                    active ? "text-[var(--color-primary)]" : "text-[var(--color-dark)]"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {Icon && <Icon size={18} />}
                  {link.label}
                </Link>
              );
            })}
            {session ? (
              <>
                <hr className="border-[var(--color-border-light)] my-1" />
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
                  href="/islerim"
                  className="flex items-center gap-3 py-2.5 text-sm font-medium text-[var(--color-dark)]"
                  onClick={() => setMenuOpen(false)}
                >
                  <Briefcase size={18} />
                  İşlerim
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
                  href="/is-ver"
                  className="btn-primary !w-full text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  İş Oluştur
                </Link>
                <Link
                  href="/auth/kayit"
                  className="block text-center py-2.5 text-sm font-medium text-[var(--color-dark)] border border-[var(--color-border-default)] rounded-lg"
                  onClick={() => setMenuOpen(false)}
                >
                  Montajcı Kaydı
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
