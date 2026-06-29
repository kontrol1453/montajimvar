import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import JobDetailClient from "./JobDetailClient";

export const dynamic = "force-dynamic";

const VALID_STATUSES = [
  "pending", "offers_received", "assigned", "en_route",
  "in_progress", "completed", "review_pending", "cancelled",
];

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/giris");

  const { id } = await params;
  const jobId = Number(id);

  if (isNaN(jobId)) redirect("/islerim");

  const userId = Number((session.user as any).id);
  const userRoles = (session.user as any).roles || [];

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      customer: {
        select: { id: true, name: true, avatar: true, phone: true },
      },
      categories: {
        include: { category: { select: { id: true, name: true, slug: true, icon: true } } },
      },
      offers: {
        orderBy: { amount: "asc" },
        include: {
          artisan: {
            select: {
              id: true,
              name: true,
              avatar: true,
              profile: { select: { companyName: true, ratingAvg: true, reviewCount: true } },
            },
          },
        },
      },
      timeline: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-dark-card flex items-center justify-center">
            <svg className="w-10 h-10 text-sub-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">İş Bulunamadı</h1>
          <p className="text-muted-text">Aradığınız iş mevcut değil veya kaldırılmış.</p>
        </div>
      </div>
    );
  }

  // Only customers of this job or logged-in artisans can view
  const isOwner = job.customerId === userId;
  const isArtisan = userRoles.includes("ARTISAN");

  if (!isOwner && !isArtisan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Erişim Engellendi</h1>
          <p className="text-muted-text">Bu işi görüntüleme yetkiniz yok.</p>
        </div>
      </div>
    );
  }

  const serializedJob = {
    ...job,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
    timeline: job.timeline.map((t) => ({
      ...t,
      createdAt: t.createdAt.toISOString(),
    })),
    offers: job.offers.map((o) => ({
      ...o,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
    })),
    photos: (() => {
      try {
        return JSON.parse(job.photos);
      } catch {
        return [];
      }
    })(),
  };

  // Check if current artisan has already offered
  let existingOffer = null;
  if (isArtisan) {
    existingOffer = job.offers.find((o) => o.artisanId === userId) || null;
  }

  return (
    <JobDetailClient
      job={serializedJob}
      userId={userId}
      isOwner={isOwner}
      isArtisan={isArtisan}
      existingOffer={existingOffer ? { ...existingOffer, createdAt: existingOffer.createdAt.toISOString(), updatedAt: existingOffer.updatedAt.toISOString() } : null}
    />
  );
}
