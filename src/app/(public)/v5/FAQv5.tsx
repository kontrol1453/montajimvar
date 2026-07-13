import { HelpCircle } from "lucide-react";
import { FAQ_ITEMS } from "./_lib/v5.constants";

export default function FAQv5() {
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
          {FAQ_ITEMS.map((f, idx) => (
            <details
              key={f.id}
              className="group"
              open={idx === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 hover:text-primary">
                <span className="text-sm font-semibold text-text-primary group-hover:text-primary">
                  {f.question}
                </span>
                <span className="shrink-0 text-text-tertiary transition-transform duration-200 group-open:rotate-180">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-4 text-sm leading-relaxed text-text-secondary">
                {f.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}