"use client";

import { Shield, Award, BadgeCheck, Lock } from "lucide-react";

const badges = [
  { icon: BadgeCheck, text: "Kimlik Doğrulanmış Ustalar" },
  { icon: Shield, text: "Sigortalı Hizmet" },
  { icon: Lock, text: "Güvenli Ödeme" },
  { icon: Award, text: "SLA Garantili" },
];

const partners = [
  "XYZ Mağazacılık", "ABC Mobilya", "DEF AVM Yönetimi",
  "GHI Fuarcılık", "KLM İnşaat", "PRS Teknoloji",
];

export default function TrustBand() {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="container-app">
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {badges.map((b) => (
            <div
              key={b.text}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm text-[var(--color-text-tertiary)]"
            >
              <b.icon size={16} className="text-[#00C853]" />
              {b.text}
            </div>
          ))}
        </div>

        <p className="text-center text-sm font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-6">
          Bizimle Çalışan Firmalar
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4">
          {partners.map((name) => (
            <div
              key={name}
              className="text-lg font-bold text-gray-300 hover:text-gray-400 transition-colors select-none"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
