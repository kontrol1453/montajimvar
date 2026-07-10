"use client";

import { HOW_IT_WORKS_STEPS } from "./homepage.constants";

export default function HowItWorksV4() {
  return (
    <section className="py-24 bg-[var(--color-surface-secondary)]" id="nasil-calisir">
      <div className="container-app">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-label">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
            Süreç
          </span>
          <h2 className="heading-lg mt-4 mb-3">
            Nasıl Çalışır?
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Dört basit adımda ihtiyacınız olan montaj uzmanını bulun.
          </p>
        </div>
      </div>
    </section>
  );
}
