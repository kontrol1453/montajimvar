"use client";

import { FEATURES_GRID } from "./homepage.constants";

export default function PlatformFeatures() {
  return (
    <section className="py-24 bg-white">
      <div className="container-app">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="section-label">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
            Platform Özellikleri
          </span>
          <h2 className="heading-lg mt-4 mb-3">
            İhtiyacın Olan Her Şey Tek Platformda
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Montaj sürecinin her aşaması için özel olarak tasarlanmış araçlar.
          </p>
        </div>
      </div>
    </section>
  );
}
