import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import FirmaForm from "./FirmaForm";
import PortfolioSection from "@/components/PortfolioSection";

export default async function FirmaPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/giris");

  const userId = (session.user as any).id;
  const roles: string[] = (session.user as any).roles || [];

  if (!roles.includes("ASSEMBLER") && !roles.includes("MANUFACTURER")) {
    redirect("/dashboard");
  }

  const [profile, user, categories] = await Promise.all([
    prisma.profile.findUnique({
      where: { userId },
      include: { category: true, categories: { select: { categoryId: true } } },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { coverPhoto: true, bio: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const categoryIds = profile?.categories?.map((pc) => pc.categoryId) || [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">
        {profile ? "Firma Profilim" : "Firma Profili Oluştur"}
      </h1>
      <FirmaForm profile={profile} categoryIds={categoryIds} categories={categories} />

      {profile && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-6">Portföy & Uzmanlıklar</h2>
          <PortfolioSection
            userId={userId}
            categories={categories}
            initialCoverPhoto={user?.coverPhoto}
            initialBio={user?.bio}
          />
        </div>
      )}
    </div>
  );
}
