import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
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
  const session = await auth();

  const profile = await prisma.profile.findUnique({
    where: { id: Number(id) },
    include: {
      category: true,
      categories: {
        include: { category: true },
      },
      user: { select: { id: true, name: true, email: true, phone: true, roles: true, createdAt: true } },
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

  const isPublicProfile = !["ASSEMBLER", "MANUFACTURER"].some(r => (profile.user.roles as string[]).includes(r));

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
                <Badge variant="success">Onaylı Firma</Badge>
              )}
              {isPublicProfile && <FavoriteButton profileId={profile.id} />}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-text">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-sub-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {profile.city}
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
              <span className="text-sub-text w-5 text-center">
                <svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </span>
              <span className="text-white">{profile.user.name}</span>
            </div>
            {profile.phone && (
              <div className="flex items-center gap-2">
                <span className="text-sub-text w-5 text-center">
                  <svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </span>
                <a href={`tel:${profile.phone}`} className="text-montaj hover:underline">
                  {profile.phone}
                </a>
              </div>
            )}
            {profile.whatsapp && (
              <div className="flex items-center gap-2">
                <span className="text-sub-text w-5 text-center">
                  <svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21.75 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 2.25 14.205 2.25 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                </span>
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
              <span className="text-sub-text w-5 text-center">
                <svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </span>
              <a href={`mailto:${profile.user.email}`} className="text-montaj hover:underline break-all">
                {profile.user.email}
              </a>
            </div>
            {profile.address && (
              <div className="flex items-start gap-2">
                <span className="text-sub-text w-5 text-center mt-0.5">
                  <svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </span>
                <span className="text-white">{profile.address}, {profile.city}</span>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-2">
                <span className="text-sub-text w-5 text-center">
                  <svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                </span>
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
