"use client";

import { useState } from "react";
import { Briefcase, DollarSign, Search, HardHat, Building2, X } from "lucide-react";
import Link from "next/link";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    {
      label: "Montaj işi oluşturmak istiyorum",
      icon: Briefcase,
      href: "/is-ver",
      color: "#0B5FFF",
    },
    {
      label: "Yaklaşık fiyat öğrenmek istiyorum",
      icon: DollarSign,
      href: "/ara",
      color: "#00C853",
    },
    {
      label: "Montaj ekibi arıyorum",
      icon: Search,
      href: "/ara",
      color: "#F59E0B",
    },
    {
      label: "Montajcı olarak kayıt olmak istiyorum",
      icon: HardHat,
      href: "/auth/kayit",
      color: "#8B5CF6",
    },
    {
      label: "Kurumsal çözüm arıyorum",
      icon: Building2,
      href: "/ara?tip=kurumsal",
      color: "#EC4899",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-[var(--color-primary)] text-white shadow-xl shadow-[0_8px_32px_rgba(11,95,255,0.3)] hover:shadow-[0_12px_48px_rgba(11,95,255,0.4)] transition-all duration-300"
        >
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-5 h-5"
          >
            <path d="M12 22c1.104 0 2-0.896 2-2h-4c0 1.104 0.896 2 2 2z" />
            <path d="M12 11.5V8m0" />
          </svg>
        </button>

        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--color-primary)] text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
          Montaj Asistanı
        </div>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-[var(--color-border-light)] animate-fade-in">
          <div className="p-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-semibold text-[var(--color-dark)]">
                Montaj Asistanı
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-[var(--color-surface-secondary)] transition-colors"
              >
                <X size={16} className="text-[var(--color-text-tertiary)]" />
              </button>
            </div>
            <p className="text-sm text-[var(--color-text-tertiary)] mb-4">
              Size nasıl yardımcı olabiliriz?
            </p>
            <div className="space-y-2">
              {options.map((opt) => (
                <Link
                  key={opt.label}
                  href={opt.href}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-border-light)] hover:bg-[var(--color-surface-secondary)] transition-colors"
                >
                  <div
                    className="w-9 h-9 flex items-center justify-center rounded-full shrink-0"
                    style={{ background: `${opt.color}15` }}
                  >
                    <opt.icon size={16} style={{ color: opt.color }} />
                  </div>
                  <p className="text-sm font-medium text-[var(--color-dark)] leading-snug">
                    {opt.label}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}