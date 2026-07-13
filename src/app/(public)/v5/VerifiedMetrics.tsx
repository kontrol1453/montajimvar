import { Users, MapPin, Star, Layers } from "lucide-react";

interface VerifiedMetricsProps {
  profileCount: number;
  cityCount: number;
  avgRating: number;
  categoryCount: number;
}

type MetricItem = {
  id: string;
  Icon: typeof Users;
  value: string;
  label: string;
  helper: string;
};

function buildMetrics(props: VerifiedMetricsProps): MetricItem[] {
  const items: MetricItem[] = [
    {
      id: "pros",
      Icon: Users,
      value: props.profileCount.toString(),
      label: "Doğrulanmış ekip",
      helper: "Platforma kayıtlı profil",
    },
    {
      id: "cities",
      Icon: MapPin,
      value: props.cityCount.toString(),
      label: "Şehir",
      helper: "Aktif hizmet edilen il",
    },
    {
      id: "rating",
      Icon: Star,
      value: props.avgRating > 0 ? props.avgRating.toFixed(1) : "—",
      label: "Ortalama puan",
      helper: "Müşteri puanlamasından",
    },
    {
      id: "categories",
      Icon: Layers,
      value: props.categoryCount.toString(),
      label: "Hizmet kategorisi",
      helper: "Veritabanındaki aktif kayıt",
    },
  ];
  return items;
}

export default function VerifiedMetrics(props: VerifiedMetricsProps) {
  const items = buildMetrics(props);

  return (
    <section
      aria-labelledby="metrics-headline"
      className="bg-surface"
    >
      <div className="container-app py-16 md:py-22">
        <div className="max-w-2xl">
          <span className="section-label">
            <Star className="h-3.5 w-3.5" /> Sayılarla · Doğrulanmış
          </span>
          <h2 id="metrics-headline" className="heading-lg mt-3">
            İstatistikler gerçek.
          </h2>
          <p className="mt-3 text-text-secondary">
            Aşağıdaki rakamlar Montajım Var platformundan çekilir — tahmin,
            örnekleme veya pazarlama masası değildir. Doğruluk{" "}
            <strong className="font-semibold text-text-primary">
              12 Temmuz 2026
            </strong>{" "}
            tarihiyle Prisma üzerinden sorgulanmıştır.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((m) => (
            <div
              key={m.id}
              className="flex flex-col rounded-card border border-border bg-app/30 p-5 shadow-card"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <m.Icon className="h-5 w-5" />
              </span>
              <div className="mt-4 text-3xl font-bold tracking-tight text-text-primary">
                {m.value}
              </div>
              <div className="mt-1 text-sm font-semibold text-text-primary">
                {m.label}
              </div>
              <div className="mt-0.5 text-xs text-text-tertiary">
                {m.helper}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-text-tertiary">
          Değerler Prisma veritabanından canlı okunur (page.tsx →{" "}
          <code className="rounded bg-app px-1 py-0.5">
            getHomeData()
          </code>
          ). Bu bölüm, sayfa yüklendiği anda sorgulanır.
        </p>
      </div>
    </section>
  );
}
