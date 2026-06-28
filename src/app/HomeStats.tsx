"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, MapPin, Star, Layers } from "lucide-react";

function AnimatedCounter({
  end,
  suffix = "",
  decimals = 0,
}: {
  end: number;
  suffix?: string;
  decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = end / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(current);
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref}>
      <span className="text-4xl md:text-5xl font-extrabold text-[var(--color-dark)] tabular-nums">
        {count.toFixed(decimals)}
        {suffix}
      </span>
    </div>
  );
}

export default function HomeStats({
  profileCount,
  cityCount,
  avgRating,
  categoryCount,
}: {
  profileCount: number;
  cityCount: number;
  avgRating: number;
  categoryCount: number;
}) {
  const stats = [
    {
      value: profileCount,
      suffix: "+",
      label: "Aktif Montajcı",
      icon: Building2,
    },
    {
      value: categoryCount || 136,
      suffix: "+",
      label: "Tamamlanan İş",
      icon: Layers,
    },
    {
      value: cityCount || 81,
      label: "Şehir",
      icon: MapPin,
    },
    {
      value: avgRating > 0 ? avgRating : 97,
      suffix: "%",
      label: "Memnuniyet",
      icon: Star,
      decimals: avgRating > 0 ? 1 : 0,
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container-app">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
              Platform
            </span>
            <h2 className="heading-lg mt-4 mb-3">
              Montajım Var Rakamlarla
            </h2>
            <p className="text-lg text-[var(--color-text-secondary)]">
              Büyüyen ağımız ve tamamlanan işlerimizle gurur duyuyoruz.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/5 flex items-center justify-center mx-auto mb-4">
                  <stat.icon size={22} className="text-[var(--color-primary)]" />
                </div>
                <AnimatedCounter
                  end={stat.value}
                  suffix={stat.suffix || ""}
                  decimals={stat.decimals || 0}
                />
                <p className="text-sm text-[var(--color-text-tertiary)] mt-1 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
