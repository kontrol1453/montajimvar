import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function toCSV(headers: string[], rows: string[][]): string {
  const escape = (val: string) => `"${val.replace(/"/g, '""')}"`;
  return [headers.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n");
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "users";

  if (type === "users") {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { profile: { select: { companyName: true } } },
    });

    const headers = ["ID", "Ad", "E-posta", "Roller", "Şehir", "Doğrulanmış", "Premium Bitiş", "Profil", "Oluşturma"];
    const rows = users.map((u) => [
      String(u.id),
      u.name,
      u.email,
      u.roles.join(", "),
      u.city ?? "",
      u.emailVerified ? "Evet" : "Hayır",
      u.premiumUntil?.toISOString() ?? "",
      u.profile?.companyName ?? "",
      u.createdAt.toISOString(),
    ]);

    const csv = toCSV(headers, rows);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="kullanicilar-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  if (type === "profiles") {
    const profiles = await prisma.profile.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } }, categories: { include: { category: true } } },
    });

    const headers = ["ID", "Firma Adı", "Sahip", "Sahip E-posta", "Kategoriler", "Şehir", "Onaylı", "Öne Çıkan", "Oluşturma"];
    const rows = profiles.map((p) => [
      String(p.id),
      p.companyName,
      p.user.name,
      p.user.email,
      p.categories.map((c) => c.category.name).join("; "),
      p.city ?? "",
      p.isVerified ? "Evet" : "Hayır",
      p.isFeatured ? "Evet" : "Hayır",
      p.createdAt.toISOString(),
    ]);

    const csv = toCSV(headers, rows);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="firmalar-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  if (type === "reviews") {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: { profile: { select: { companyName: true } }, user: { select: { name: true, email: true } } },
    });

    const headers = ["ID", "Firma", "Puan", "Yorum", "Yazar", "Yazar E-posta", "Oluşturma"];
    const rows = reviews.map((r) => [
      String(r.id),
      r.profile.companyName,
      String(r.rating),
      r.comment ?? "",
      r.user.name,
      r.user.email,
      r.createdAt.toISOString(),
    ]);

    const csv = toCSV(headers, rows);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="yorumlar-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  if (type === "certificates") {
    const skills = await prisma.artisanSkill.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true, user: { select: { name: true, email: true } } },
    });

    const headers = ["ID", "Usta", "Usta E-posta", "Kategori", "Başlık", "Yıl", "Sertifika URL", "Onaylı", "Oluşturma"];
    const rows = skills.map((s) => [
      String(s.id),
      s.user.name,
      s.user.email,
      s.category.name,
      s.title ?? "",
      String(s.yearsExp ?? ""),
      s.certificate ?? "",
      s.verified ? "Evet" : "Hayır",
      s.createdAt.toISOString(),
    ]);

    const csv = toCSV(headers, rows);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="sertifikalar-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  if (type === "jobs") {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      include: { customer: { select: { name: true, email: true } }, offers: true, categories: { include: { category: true } } },
    });

    const headers = ["ID", "Başlık", "Durum", "Şehir", "Müşteri", "Müşteri E-posta", "Bütçe Min", "Bütçe Max", "Kategoriler", "Teklif Sayısı", "Oluşturma"];
    const rows = jobs.map((j) => [
      String(j.id),
      j.title,
      j.status,
      j.city,
      j.customer.name,
      j.customer.email,
      String(j.budgetMin ?? ""),
      String(j.budgetMax ?? ""),
      j.categories.map((c) => c.category.name).join("; "),
      String(j.offers.length),
      j.createdAt.toISOString(),
    ]);

    const csv = toCSV(headers, rows);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="isler-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  if (type === "disputes") {
    const disputes = await prisma.dispute.findMany({
      orderBy: { createdAt: "desc" },
      include: { job: { select: { title: true } }, openedBy: { select: { name: true } }, payment: { select: { amount: true, status: true } } },
    });

    const headers = ["ID", "İş", "Açan", "Sebep", "Çözüm", "Durum", "Ödeme Tutarı", "Ödeme Durumu", "Oluşturma", "Çözülme"];
    const rows = disputes.map((d) => [
      String(d.id),
      d.job.title,
      d.openedBy.name,
      d.reason,
      d.resolution ?? "",
      d.status,
      d.payment ? String(d.payment.amount) : "",
      d.payment?.status ?? "",
      d.createdAt.toISOString(),
      d.resolvedAt?.toISOString() ?? "",
    ]);

    const csv = toCSV(headers, rows);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="anlasmazliklar-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

if (type === "blog") {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });

    const headers = ["ID", "Başlık", "Slug", "Kategori", "Yayınlandı", "Yayınlanma Tarihi", "Oluşturma", "Güncelleme"];
    const rows = posts.map((p) => [
      String(p.id),
      p.title,
      p.slug,
      p.category?.name ?? "",
      p.isPublished ? "Evet" : "Hayır",
      p.publishedAt ? "Evet" : "Hayır",
      p.createdAt.toISOString(),
      p.updatedAt.toISOString(),
    ]);

    const csv = toCSV(headers, rows);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="blog-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  if (type === "categories") {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
    });

    const headers = ["ID", "Ad", "Slug", "İkon", "Sıra", "Aktif", "Oluşturma"];
    const rows = categories.map((c) => [
      String(c.id),
      c.name,
      c.slug,
      c.icon ?? "",
      String(c.sortOrder),
      c.isActive ? "Evet" : "Hayır",
      c.createdAt.toISOString(),
    ]);

    const csv = toCSV(headers, rows);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="kategoriler-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json({ error: "Geçersiz tip" }, { status: 400 });
}