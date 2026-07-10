"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AUDIENCE_CARDS } from "./homepage.constants";
import { motion } from "framer-motion";

export default function AudienceSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container-app">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="section-label">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
            Kimler İçin
          </span>
          <h2 className="heading-lg mt-4 mb-3">
            Herkes İçin Montaj Çözümleri
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            İster evinizdeki mobilya montajı, ister kurumsal projeleriniz olsun.
          </p>
        </div>
      </div>
    </section>
  );
}
