"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "./_lib/v5.constants";

export default function FAQv5() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <section
      aria-labelledby="faq-headline"
      className="bg-surface"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: f.answer,
              },
            })),
          }),
        }}
      />

      <div className="container-app py-16 md:py-22">
        <div className="max-w-2xl">
          <span className="section-label">
            <HelpCircle className="h-3.5 w-3.5" /> Sık Sorulan Sorular
          </span>
          <h2 id="faq-headline" className="heading-lg mt-3">
            Merak edilenler.
          </h2>
          <p className="mt-3 text-text-secondary">
            Dört ana soru. Detaylı bilgi için yardım merkezine göz atın.
          </p>
        </div>

        <div className="mt-10 max-w-3xl divide-y divide-border rounded-card border border-border">
          {FAQ_ITEMS.map((f) => {
            const isOpen = openId === f.id;
            return (
              <div key={f.id}>
                <button
                  onClick={() => toggle(f.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${f.id}`}
                  id={`faq-trigger-${f.id}`}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left hover:text-primary transition-colors"
                >
                  <span className="text-sm font-semibold text-text-primary">
                    {f.question}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-text-tertiary transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  id={`faq-answer-${f.id}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${f.id}`}
                  hidden={!isOpen}
                  className="px-5 pb-4 text-sm leading-relaxed text-text-secondary"
                >
                  {f.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
