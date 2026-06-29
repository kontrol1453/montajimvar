"use client";

import { useState } from "react";
import { messageSquare, sparkles, zap, phone, messageCircle, X } from "lucide-react";
import Link from "next/link";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { label: "Fiyat Hesapla", icon: zap, href: "/is-ver?ai=estimate", color: "#0B5FFF" },
    { label: "Usta Bul", icon: messageSquare, href: "/ara?q=avni", color: "#00C853" },
    { label: "İş Oluştur", icon: sparkles, href: "/is-ver", color: "#F59E0B" },
    { label: "Destek", icon: messageCircle, href: "/yardim", color: "#8B5CF6" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Main AI Button */}
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

        {/* Floating label */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--color-primary)] text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
          Montaj Asistanı
        </div>
      </div>

      {/* Quick Actions Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-64 bg-white rounded-2xl shadow-2xl border border-[var(--color-border-light)] animate-fade-in">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-[var(--color-dark)]">
                Yapay Zeka Asistanı
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-[var(--color-surface-secondary)] transition-colors"
              >
                <X size={16} className="text-[var(--color-text-tertiary)]" />
              </button>
            </div>
            <p className="text-sm text-[var(--color-text-tertiary)] mb-4">
              Size yardımcı olmaya hazırım!
            </p>
            <div className="space-y-3">
              {actions.map((action, i) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className={`flex items-center gap-3 p-3 rounded-xl border border-[var(--color-border-light)] ${
                    i % 2 === 0 ? "bg-[var(--color-primary)]/5" : "bg-[var(--color-accent)]/5"
                  } hover:bg-[var(--color-surface-secondary)] transition-colors`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full" style={{ background: `${action.color}20` }}>
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className={`text-[${action.color}]`}
                      >
                        {action.icon === "zap" && (
                          <path d="M13 4l2-2m5 7L7 17m9-1v2M7 13h12" />
                        )}
                        {action.icon === "messageSquare" && (
                          <path d="M21 15a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
                        )}
                        {action.icon === "sparkles" && (
                          <path d="M12 2.25l-1.291 1.893L6.96 5.25l2.172.317L5 6.75l1.291 1.893L9.45 8.25l1.893 1.291L12 9.75l1.893-1.291L14.55 8.25l1.291-1.893L17.04 5.25l-2.172.317L12 2.25z" />
                        )}
                        {action.icon === "messageCircle" && (
                          <path d="M21 11.5a8.38 8.38 0 01-.9 5.8A10.566 10.566 0 0110.034 21a10.566 10.566 0 01-6.252-2.364" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-dark)]">{action.label}</p>
                      <p className="text-xs text-[var(--color-text-tertiary)]">AI destekli hızlı işlem</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-[var(--color-text-tertiary)]">
                Daha akıllı sugger için Premium'a geçin
              </p>
              <Link
                href="/dashboard/uyelik"
                className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] underline"
              >
                Premium Özellikler
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}