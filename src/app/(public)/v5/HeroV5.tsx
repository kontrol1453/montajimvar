import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Star, Sparkles, MapPin, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { SiteSettings } from "@/lib/site-settings";
import { TRUST_METRICS } from "./_lib/v5.constants";
export default async function HeroV5({ settings }: { settings: SiteSettings }) {
  const popularCategories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    take: 6,
    orderBy: { sortOrder: "asc" },
  });

  return (
    <section
      aria-labelledby="hero-headline"
      className="relative isolate overflow-hidden bg-gradient-to-b from-[#f6f9ff] via-white to-white dark:from-[#0a0f1f] dark:via-[#0b1322] dark:to-[#0b1322]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-40 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 left-[-10%] h-[26rem] w-[26rem] rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="container-app pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="grid items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <span className="section-label animate-fade-in">
              <Sparkles className="h-3.5 w-3.5" /> {settings.hero.badge}
            </span>

            <h1
              id="hero-headline"
              className="heading-xl mt-5 text-balance animate-fade-in-up"
            >
              {settings.hero.headline.replace(settings.hero.headlineHighlight, "")}
              <span className="gradient-text">{settings.hero.headlineHighlight}</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg animate-fade-in-up">
              {settings.hero.description}
            </p>

            <div className="mt-8 animate-fade-in-up">
              <form 
                action="/ara" 
                method="GET" 
                className="relative max-w-xl group"
              >
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-text-tertiary group-focus-within:text-primary transition-colors">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    name="q"
                    placeholder={settings.hero.searchPlaceholder}
                    className="w-full pl-12 pr-32 py-4 rounded-2xl border border-border bg-surface shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-text-primary"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    {settings.hero.searchButtonLabel}
                  </button>
                </div>
              </form>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-text-tertiary">
                <span>{settings.hero.popularLabel}</span>
                {popularCategories.map((cat) => (
                  <Link 
                    key={cat.slug} 
                    href={`/ara?kategoriler=${cat.slug}`} 
                    className="px-2 py-1 rounded-full bg-muted border border-border hover:border-primary hover:text-primary transition-all"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 animate-fade-in-up">
              <Link
                href={settings.hero.primaryCta.href}
                className="btn-primary"
                aria-label={settings.hero.primaryCta.label + " sayfasını aç"}
              >
                {settings.hero.primaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={settings.hero.secondaryCta.href}
                className="btn-secondary"
              >
                {settings.hero.secondaryCta.label}
              </Link>
            </div>

            <ul
              className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-tertiary animate-fade-in-up"
              aria-label="Hızlı güven sinyalleri"
            >
              {settings.trustBar.items.map((item) => (
                <li key={item.id} className="inline-flex items-center gap-1.5">
                  {item.id === "escrow" && <ShieldCheck className="h-4 w-4 text-accent" />}
                  {item.id === "verified" && <Star className="h-4 w-4 text-amber-500" />}
                  {item.id === "coverage" && <MapPin className="h-4 w-4 text-primary" />}
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-5" aria-hidden="true">
            <div className="relative mx-auto w-full max-w-md">
              <div className="rounded-card border border-border bg-surface shadow-elevated overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                  </div>
                  <span className="text-xs text-text-tertiary ml-2 font-mono">panel.montajimvar.com</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Aktif İşler", color: "bg-primary/20" },
                      { label: "Montaj Ekibi", color: "bg-accent/20" },
                      { label: "Tamamlanma", color: "bg-amber-500/20" },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-muted/50 rounded-lg p-3 border border-border">
                        <div className="text-xs text-text-tertiary mb-1.5">{stat.label}</div>
                        <div className={`h-1.5 rounded-full ${stat.color}`} style={{ width: `${55 + Math.random() * 35}%` }} />
                      </div>
                    ))}
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 border border-border">
                    <div className="text-xs text-text-tertiary mb-2 font-medium uppercase tracking-wider">Son İşler</div>
                    <div className="space-y-2">
                      {[
                        { job: "AVM Montajı — İstanbul", status: "Devam Ediyor", color: "text-primary" },
                        { job: "Mobilya Kurulumu — Ankara", status: "Tamamlandı", color: "text-accent" },
                      ].map((item) => (
                        <div key={item.job} className="flex items-center justify-between">
                          <span className="text-xs text-text-primary">{item.job}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full bg-muted font-medium ${item.color}`}>{item.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 border border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                      <span className="text-xs text-text-primary">Canlı Ekip Takibi</span>
                    </div>
                    <span className="text-[10px] text-text-tertiary">Aktif</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-12 md:mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4"
          aria-label="Güven rozetleri"
        >
          {TRUST_METRICS.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 rounded-card border border-border bg-surface px-4 py-3 shadow-card"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <m.Icon className="h-4.5 w-4.5" />
              </span>
              <span className="text-sm font-medium text-text-primary">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
