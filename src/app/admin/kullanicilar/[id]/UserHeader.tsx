import Link from "next/link";
import { MapPin, Mail, Calendar, Shield } from "lucide-react";
import EntityHeader from "@/components/admin/entity/EntityHeader";
import EntityStatus from "@/components/admin/entity/EntityStatus";
import { formatDate } from "@/lib/utils";

interface UserHeaderProps {
  user: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    roles: string[];
    city: string | null;
    emailVerified: boolean;
    identityVerified: boolean;
    isPhoneVerified: boolean;
    premiumUntil: Date | string | null;
    createdAt: Date | string;
    profile?: {
      id: number;
      companyName: string;
      isVerified: boolean;
    } | null;
  };
  summary: {
    totalJobs: number;
    totalOffers: number;
  };
}

const ROLE_LABELS: Record<string, string> = {
  CUSTOMER: "Müşteri",
  ASSEMBLER: "Montajcı",
  MANUFACTURER: "Üretici",
  ADMIN: "Admin",
};

const ROLE_VARIANT: Record<string, "neutral" | "success" | "warning" | "info"> = {
  CUSTOMER: "neutral",
  ASSEMBLER: "success",
  MANUFACTURER: "success",
  ADMIN: "warning",
};

export default function UserHeader({ user, summary }: UserHeaderProps) {
  const initial = user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U";
  const isPremium = user.premiumUntil && new Date(user.premiumUntil) > new Date();

  return (
    <EntityHeader
      title={user.name}
      subtitle={user.email}
      avatar={
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[var(--admin-primary-soft)] text-[var(--admin-primary)] flex items-center justify-center text-xl font-bold shrink-0">
          {initial}
        </div>
      }
      badges={
        <>
          {user.roles.map((role) => (
            <EntityStatus
              key={role}
              variant={ROLE_VARIANT[role] || "neutral"}
              label={ROLE_LABELS[role] || role}
              dot={false}
            />
          ))}
          {isPremium && (
            <EntityStatus variant="premium" label="Premium" dot={false} />
          )}
          {user.emailVerified && (
            <EntityStatus variant="success" label="Doğrulandı" dot={false} />
          )}
        </>
      }
      meta={[
        { label: "ID", value: String(user.id) },
        ...(user.city ? [{ label: "Şehir", value: user.city }] : []),
        { label: "Kayıt", value: formatDate(new Date(user.createdAt)) },
      ]}
      extra={
        user.profile ? (
          <Link
            href={`/admin/firmalar/${user.profile.id}`}
            className="text-xs text-[var(--admin-primary)] hover:underline inline-flex items-center gap-1"
          >
            <Shield size={12} />
            {user.profile.companyName} firması →
          </Link>
        ) : null
      }
    />
  );
}