"use client";

import Link from "next/link";
import { ArrowRight, Shield, Award, Lock, MessageSquare } from "lucide-react";

const trustItems = [
  { icon: Shield, text: "Kimlik Doğrulanmış Ustalar" },
  { icon: Award, text: "Mesleki Yeterlilik Belgeleri" },
  { icon: Lock, text: "Güvenli Ödeme Sistemi" },
  { icon: MessageSquare, text: "Müşteri Değerlendirmeleri" },
];

export default function CorporateCta() {
  return (
    <section id="teklif" className="py-24 bg-white">
      <div className="container-app">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-3xl p-10 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-dark)] leading-tight tracking-tight mb-4">
              Kurumsal Montaj Operasyonlarınız İçin
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B5FFF] to-[#00C853]">
                Harekete Geçin
              </span>
            </h2>
            <p className="text-lg text-[var(--color-text-tertiary)] max-w-xl mx-auto mb-10">
              Ücretsiz kurumsal danışmanlık ve demo için bizimle iletişime geçin.
            </p>

            <div className="flex flex-wrap justify-center gap-8 mb-12">
              {trustItems.map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-sm text-[var(--color-text-tertiary)]">
                  <item.icon size={18} className="text-[#00C853]" />
                  {item.text}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/is-ver"
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--color-dark)] text-sm font-semibold text-white hover:bg-[var(--color-dark)]/90 transition-all hover:-translate-y-0.5"
              >
                Hemen İş Ver
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/iletisim"
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-[var(--color-dark)] hover:bg-gray-50 transition-all"
              >
                Bizimle İletişime Geçin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
