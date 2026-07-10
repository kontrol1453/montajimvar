"use client";

import { WHY_ITEMS } from "./homepage.constants";

export default function WhySection() {
  return (
    <section className="py-24 bg-white">
      <div className="container-app">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="section-label">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
            Neden Biz
          </span>
          <h2 className="heading-lg mt-4 mb-3">
            Neden Montajım Var?
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Platformumuzu farklı kılan üç temel değer.
          </p>
        </div>
      </div>
    </section>
  );
}
