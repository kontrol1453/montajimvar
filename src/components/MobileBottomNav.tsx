"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Search,
  Briefcase,
  MessageSquare,
  User,
  X,
  Sparkles,
} from "lucide-react";

const navItems = [
  { name: "Ana Sayfa", href: "/", icon: Home },
  { name: "Ara", href: "/ara", icon: Search },
  { name: "İşler", href: "/islerim", icon: Briefcase },
  { name: "Mesajlar", href: "/dashboard/mesajlar", icon: MessageSquare },
  { name: "Profil", href: "/dashboard/profil", icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-0 left-0 right-0 md:hidden z-50 bg-white border-t border-[var(--color-border-light)] shadow-elevated"
    >
      <div className="grid grid-cols-5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-3 px-2 transition-all ${
                isActive
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-text-tertiary)]"
              }`}
            >
              <div className="relative">
                <item.icon
                  size={isActive ? 24 : 22}
                  className={`transition-all ${
                    isActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-tertiary)]"
                  }`}
                />
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--color-primary)] text-white text-[9px] font-bold flex items-center justify-center"
                  >
                    <Sparkles size={8} />
                  </motion.div>
                )}
              </div>
              <span className={`text-[10px] font-medium transition-colors ${isActive ? "text-[var(--color-primary)]" : ""}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}