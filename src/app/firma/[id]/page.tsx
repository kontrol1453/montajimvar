import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import Badge from "@/components/ui/Badge";
import MessageButton from "./MessageButton";
import CompanyGallery from "./CompanyGallery";
import ReviewSection from "@/components/ReviewSection";
import FavoriteButton from "@/components/FavoriteButton";
import CompanyMap from "@/components/CompanyMap";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const profile = await prisma.profile.findUnique({
    where: { id: Number(id) },
    include: {
      category: true,
      categories: { include: { category: true } },
    },
  });
  if (!profile) return { title: "Firma Bulunamadı - Montajım Var" };
  return {
    title: `${profile.companyName} - ${profile.city} | Montajım Var`,
    description: profile.description?.slice(0, 160) || `${profile.companyName} - ${profile.city} ${profile.category.name} hizmeti`,
    openGraph: {
      title: `${profile.companyName} - ${profile.city}`,
      description: profile.description?.slice(0, 160) || "",
    },
  };
}

export default async function CompanyProfilePage({ params }: Props) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const profile = await prisma.profile.findUnique({
    where: { id: Number(id) },
    include: {
      category: true,
      categories: {
        include: { category: true },
      },
      user: { select: { id: true, name: true, email: true, phone: true, createdAt: true } },
    },
  });

  if (!profile) {
    notFound();
  }

  // Increment view count (skip owner's own views)
  const viewerId = (session?.user as any)?.id;
  if (viewerId && viewerId !== profile.user.id) {
    await prisma.profile.update({
      where: { id: profile.id },
      data: { viewCount: { increment: 1 } },
    });
  }

  const roleBadge =
    profile.user.id === (session?.user as any)?.id
      ? null
      : profile.user.id === (session?.user as any)?.id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Üst Bilgi */}
      <div className="bg-dark-card rounded-xl border border-dark-border p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Logo / Avatar */}
          <div className="w-20 h-20 bg-montaj/20 rounded-2xl flex items-center justify-center text-3xl font-bold text-montaj shrink-0">
            {profile.companyName[0]?.toUpperCase() || "?"}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {profile.companyName}
              </h1>
              {profile.isVerified && (
                <Badge variant="success">✔ Onaylı Firma</Badge>
              )}
              <FavoriteButton profileId={profile.id} />
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-text">
              <span className="flex items-center gap-1">
                📍 {profile.city}
              </span>
              <span>·</span>
              <div className="flex flex-wrap gap-1.5">
                {profile.categories.map((pc) => (
                  <Badge key={pc.categoryId} variant="default">{pc.category.name}</Badge>
                ))}
              </div>
              <span>·</span>
              <span>Kayıt: {formatDate(profile.user.createdAt)}</span>
            </div>

            {profile.description && (
              <p className="mt-4 text-gray-200 whitespace-pre-line">
                {profile.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <CompanyGallery profileId={profile.id} />

      {/* İletişim Bilgileri */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-dark-card rounded-xl border border-dark-border p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            İletişim Bilgileri
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-sub-text">👤</span>
              <span className="text-white">{profile.user.name}</span>
            </div>
            {profile.phone && (
              <div className="flex items-center gap-2">
                <span className="text-sub-text">📞</span>
                <a href={`tel:${profile.phone}`} className="text-montaj hover:underline">
                  {profile.phone}
                </a>
              </div>
            )}
            {profile.whatsapp && (
              <div className="flex items-center gap-2">
                <span className="text-sub-text">💬</span>
                <a
                  href={`https://wa.me/90${profile.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:underline"
                >
                  {profile.whatsapp}
                </a>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sub-text">✉️</span>
              <a href={`mailto:${profile.user.email}`} className="text-montaj hover:underline break-all">
                {profile.user.email}
              </a>
            </div>
            {profile.address && (
              <div className="flex items-start gap-2">
                <span className="text-sub-text mt-0.5">📍</span>
                <span className="text-white">{profile.address}, {profile.city}</span>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-2">
                <span className="text-sub-text">🌐</span>
                <a
                  href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-montaj hover:underline"
                >
                  {profile.website}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Mesaj Gönder */}
        <div className="bg-dark-card rounded-xl border border-dark-border p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            İletişime Geç
          </h2>
          <MessageButton
            profileId={profile.id}
            companyName={profile.companyName}
            isOwner={session?.user ? (session.user as any).id === profile.user.id : false}
          />
        </div>
      </div>

      {/* Harita */}
      {profile.latitude && profile.longitude && (
        <div className="bg-dark-card rounded-xl border border-dark-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Konum</h2>
          <CompanyMap
            latitude={profile.latitude}
            longitude={profile.longitude}
            companyName={profile.companyName}
            address={profile.address}
            city={profile.city}
          />
        </div>
      )}

      {/* Değerlendirmeler */}
      <div className="mb-6">
        <ReviewSection
          profileId={profile.id}
          isOwner={session?.user ? (session.user as any).id === profile.user.id : false}
        />
      </div>
    </div>
  );
}
