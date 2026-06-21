import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import FirmaForm from "./FirmaForm";

export default async function FirmaPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/giris");

  const userId = (session.user as any).id;
  const roles: string[] = (session.user as any).roles || [];

  if (!roles.includes("ASSEMBLER") && !roles.includes("MANUFACTURER")) {
    redirect("/dashboard");
  }

  const [profile, categories] = await Promise.all([
    prisma.profile.findUnique({
      where: { userId },
      include: { category: true, categories: { select: { categoryId: true } } },
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
    </div>
  );
}
