"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import UnreadBadge from "./UnreadBadge";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
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

  const user = session?.user as { name?: string; email?: string; role?: string; id?: number; avatar?: string } | undefined;

  return (
    <nav className="bg-dark-bg/85 backdrop-blur-xl border-b border-dark-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🔧</span>
            <span className="font-bold text-xl text-montaj">Montajım Var</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/ara" className="text-muted-text hover:text-montaj transition">
              Firmalar
            </Link>
            {session ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 text-muted-text hover:text-montaj transition"
                >
                  <span className="w-8 h-8 bg-montaj/20 rounded-full flex items-center justify-center text-montaj font-semibold text-sm overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.[0]?.toUpperCase() || "?"
                    )}
                  </span>
                  <span className="hidden lg:inline">{user?.name}</span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-dark-card rounded-lg shadow-lg border border-dark-border py-1">
                    <div className="px-4 py-2 border-b border-dark-border">
                      <p className="text-sm font-medium text-white">{user?.name}</p>
                      <p className="text-xs text-sub-text">{user?.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-dark-section"
                      onClick={() => setProfileOpen(false)}
                    >
                      Panelim
                    </Link>
                    <Link
                      href="/dashboard/mesajlar"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-dark-section relative"
                      onClick={() => setProfileOpen(false)}
                    >
                      Mesajlarım
                      <UnreadBadge />
                    </Link>
                    <Link
                      href="/dashboard/favoriler"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-dark-section"
                      onClick={() => setProfileOpen(false)}
                    >
                      Favorilerim
                    </Link>
                    <Link
                      href="/dashboard/profil"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-dark-section"
                      onClick={() => setProfileOpen(false)}
                    >
                      Profilim
                    </Link>
                    {(user?.role === "ASSEMBLER" || user?.role === "MANUFACTURER") && (
                      <Link
                        href="/dashboard/firma"
                        className="block px-4 py-2 text-sm text-gray-200 hover:bg-dark-section"
                        onClick={() => setProfileOpen(false)}
                      >
                        Firma Profilim
                      </Link>
                    )}
                    <hr className="my-1 border-dark-border" />
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/giris"
                  className="text-muted-text hover:text-montaj transition px-3 py-2"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/auth/kayit"
                  className="bg-montaj text-white px-4 py-2 rounded-lg hover:bg-montaj-dark transition"
                >
                  Kaydol
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-dark-card"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menüyü aç/kapa"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-dark-border bg-dark-bg px-4 py-3 space-y-2">
          <Link
            href="/ara"
            className="block py-2 text-muted-text hover:text-montaj"
            onClick={() => setMenuOpen(false)}
          >
            Firmalar
          </Link>
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="block py-2 text-muted-text hover:text-montaj"
                onClick={() => setMenuOpen(false)}
              >
                Panelim
              </Link>
              <Link
                href="/dashboard/mesajlar"
                className="block py-2 text-muted-text hover:text-montaj relative inline-flex items-center"
                onClick={() => setMenuOpen(false)}
              >
                Mesajlarım
                <span className="ml-1"><UnreadBadge /></span>
              </Link>
              <Link
                href="/dashboard/favoriler"
                className="block py-2 text-muted-text hover:text-montaj"
                onClick={() => setMenuOpen(false)}
              >
                Favorilerim
              </Link>
              <Link
                href="/dashboard/profil"
                className="block py-2 text-muted-text hover:text-montaj"
                onClick={() => setMenuOpen(false)}
              >
                Profilim
              </Link>
              {(user?.role === "ASSEMBLER" || user?.role === "MANUFACTURER") && (
                <Link
                  href="/dashboard/firma"
                  className="block py-2 text-muted-text hover:text-montaj"
                  onClick={() => setMenuOpen(false)}
                >
                  Firma Profilim
                </Link>
              )}
              <button
                onClick={() => { setMenuOpen(false); signOut(); }}
                className="block w-full text-left py-2 text-red-400"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/auth/giris"
                className="block text-center py-2 text-muted-text border border-dark-border rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                Giriş Yap
              </Link>
              <Link
                href="/auth/kayit"
                className="block text-center py-2 bg-montaj text-white rounded-lg"
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
