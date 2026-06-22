import Link from "next/link";
import type { Profile } from "@prisma/client";
import Badge from "@/components/ui/Badge";
import PremiumBadge from "@/components/PremiumBadge";

interface CompanyCardProps {
  profile: Profile & {
    category: { name: string; slug: string };
    categories?: { category: { name: string; slug: string } }[];
    user: { id: number; name: string; email: string; phone: string | null };
  };
}

export default function CompanyCard({ profile }: CompanyCardProps) {
  return (
    <Link
      href={`/firma/${profile.id}`}
      className="block bg-dark-card rounded-xl border border-dark-border hover:border-montaj/50 transition p-6"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 bg-montaj/20 rounded-lg flex items-center justify-center text-xl font-bold text-montaj">
          {profile.companyName[0]?.toUpperCase() || "?"}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {(profile as any).premiumUntil && new Date((profile as any).premiumUntil) > new Date() && (
            <PremiumBadge label={(profile as any).subscription?.badgeLabel || "Premium"} color={(profile as any).subscription?.badgeColor || "amber"} />
          )}
          {(profile as any).isFeatured && (
            <Badge variant="warning">Vitrin</Badge>
          )}
          {profile.isVerified && (
            <Badge variant="success">Onaylı</Badge>
          )}
        </div>
      </div>

      <h3 className="font-semibold text-white mb-1 line-clamp-1">
        {profile.companyName}
      </h3>

      <div className="flex items-center gap-2 text-sm text-sub-text mb-2">
        <span>{profile.city}</span>
        <span>·</span>
        <div className="flex flex-wrap gap-1">
          <Badge variant="default">{profile.category.name}</Badge>
          {profile.categories
            ?.filter((pc) => pc.category.name !== profile.category.name)
            .slice(0, 2)
            .map((pc) => (
              <Badge key={pc.category.name} variant="default">{pc.category.name}</Badge>
            ))}
          {(profile.categories?.length ?? 0) > 3 && (
            <span className="text-xs text-sub-text self-center">
              +{((profile.categories?.length ?? 0) - 1)}
            </span>
          )}
        </div>
      </div>

      {(profile as any).reviewCount > 0 && (
        <div className="flex items-center gap-1 text-sm text-montaj mb-2">
          <span>★</span>
          <span className="font-medium">{(profile as any).ratingAvg?.toFixed(1)}</span>
          <span className="text-sub-text">({(profile as any).reviewCount})</span>
        </div>
      )}

      <p className="text-sm text-muted-text line-clamp-2">
        {profile.description || "Henüz açıklama eklenmemiş."}
      </p>

      {(profile as any).whatsapp && (
        <div className="mt-3 flex items-center gap-1.5 text-sm text-green-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21.75 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 2.25 14.205 2.25 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
          <span>WhatsApp ile iletişim</span>
        </div>
      )}
    </Link>
  );
}
