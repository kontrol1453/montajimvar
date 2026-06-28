"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Building2,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Bell,
  Calendar,
  TrendingUp,
  Shield,
  CreditCard,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: "Ana Sayfa", href: "/dashboard", icon: LayoutDashboard },
  { name: "Bugünkü İşler", href: "/dashboard/isler", icon: Calendar },
  { name: "Mesajlar", href: "/dashboard/mesajlar", icon: MessageSquare },
  { name: "Gelirler", href: "/dashboard/gelirler", icon: CreditCard },
  { name: "Bekleyen Teklifler", href: "/dashboard/teklifler", icon: TrendingUp },
  { name: "Aktif Ekip", href: "/dashboard/ekip", icon: Users },
  { name: "Firma Profilim", href: "/dashboard/firma", icon: Building2 },
  { name: "Üyelik", href: "/dashboard/uyelik", icon: Shield },
  { name: "Ayarlar", href: "/dashboard/ayarlar", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-surface-secondary)]">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: sidebarOpen || mobileSidebarOpen ? "280px" : "0px", opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`fixed md:relative inset-y-0 left-0 z-50 bg-white border-r border-[var(--color-border-light)] transition-all duration-300 flex flex-col overflow-hidden ${
            mobileSidebarOpen ? "md:hidden" : ""
          }`}
        >
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-[var(--color-border-light)]">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span
                className="font-extrabold text-xl tracking-tight"
                style={{ fontFamily: "'Manrope', system-ui, sans-serif", color: "var(--color-dark)" }}
              >
                Montajım<span style={{ color: "var(--color-primary)" }}>Var</span>
              </span>
            </Link>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-[var(--color-surface-secondary)]"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[var(--color-primary)] text-white shadow-[0_4px_12px_rgba(11,95,255,0.25)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text-primary)]"
                  }`}
                  onClick={() => setMobileSidebarOpen(false)}
                >
                  <item.icon size={20} className="shrink-0" />
                  {item.name}
                  {isActive && <ChevronRight size={16} className="ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* Bottom: Logout */}
          <div className="p-4 border-t border-[var(--color-border-light)]">
            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              onClick={() => { /* signOut logic */ }}
            >
              <LogOut size={20} />
              Çıkış Yap
            </button>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* Main Content */}
      <div className="md:ml-0 transition-all duration-300 min-h-screen flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-[var(--color-border-light)]">
          <div className="container-app">
            <div className="flex items-center justify-between h-16">
              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)]"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu size={22} />
              </button>

              {/* Page Title */}
              <div className="flex-1 md:flex-1">
                <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
                  {navigation.find((n) => pathname === n.href || pathname.startsWith(n.href + "/"))?.name || "Dashboard"}
                </h1>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] transition-colors">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg hover:bg-[var(--color-surface-secondary)] transition-all">
                    <span className="w-7 h-7 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center text-[var(--color-primary)] font-semibold text-xs">
                      U
                    </span>
                    <span className="text-sm font-medium text-[var(--color-text-primary)] hidden lg:inline">Kullanıcı</span>
                    <ChevronRight size={14} className="text-[var(--color-text-tertiary)]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 container-app py-8">
          {children}
        </main>
      </div>
    </div>
  );
}