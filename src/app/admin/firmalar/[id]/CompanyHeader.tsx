import Link from "next/link";
import { MapPin, Phone, Globe, Shield, Star } from "lucide-react";
import EntityHeader from "@/components/admin/entity/EntityHeader";
import EntityStatus from "@/components/admin/entity/EntityStatus";
import { formatDate } from "@/lib/utils";

export default function CompanyHeader({ profile, summary }: any) {
  const initial = profile.companyName?.[0]?.toUpperCase() || "F";

  return (
    <EntityHeader
      title={profile.companyName}
      subtitle={profile.description?.slice(0, 100) || undefined}
      avatar={
        profile.logo ? (
          <img src={profile.logo} alt="" className="w-16 h-16 rounded-lg object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-[var(--admin-warning-soft)] text-[var(--admin-warning)] flex items-center justify-center text-xl font-bold">
            {initial}
          </div>
        )
      }
      badges={
        <>
          {profile.isVerified ? (
            <EntityStatus variant="success" label="Onaylı" dot={false} />
          ) : (
            <EntityStatus variant="warning" label="Onay Bekliyor" dot={false} />
          )}
          {profile.isFeatured && (
            <EntityStatus variant="premium" label="Vitrinde" dot={false} />
          )}
          {profile.category && (
            <EntityStatus variant="info" label={profile.category.name} dot={false} />
          )}
        </>
      }
      meta={[
        { label: "ID", value: String(profile.id) },
        { label: "Şehir", value: profile.city },
        ...(profile.ratingAvg > 0 ? [{ label: "Puan", value: `${profile.ratingAvg}/5 (${profile.reviewCount} yorum)` }] : []),
        { label: "Kayıt", value: formatDate(new Date(profile.createdAt)) },
      ]}
      extra={
        <Link
          href={`/admin/kullanicilar/${profile.user.id}`}
          className="text-xs text-[var(--admin-primary)] hover:underline inline-flex items-center gap-1"
        >
          <span>{profile.user.name} →</span>
        </Link>
      }
    />
  );
}