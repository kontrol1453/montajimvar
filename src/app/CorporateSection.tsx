"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CORPORATE_BENEFITS } from "./homepage.constants";

export default function CorporateSection() {
  return (
    <section className="py-24 section-dark relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#0B5FFF]/5 rounded-full blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>
      <div className="container-app relative">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.06] border border-white/[0.08] rounded-full text-xs text-white font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C853]" />
            Kurumsal
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-4 mb-3 leading-tight tracking-tight">
            Kurumsal Montaj{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B5FFF] to-[#00C853]">
              Operasyonları
            </span>
            <br />İçin Güçlü Altyapı
          </h2>
          <p className="text-lg text-white/70 max-w-xl mx-auto">
            Zincir mağaza, AVM ve fuar projelerinizi tek merkezden yönetin.
          </p>
        </div>
      </div>
    </section>
  );
}
