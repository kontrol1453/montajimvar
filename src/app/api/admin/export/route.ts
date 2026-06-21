import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function escapeCSV(val: unknown): string {
  const s = String(val ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCSV(headers: string[], rows: string[][]): string {
  const headerLine = headers.map(escapeCSV).join(",");
  const dataLines = rows.map((r) => r.map(escapeCSV).join(","));
  return [headerLine, ...dataLines, ""].join("\n");
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
  }

  const type = req.nextUrl.searchParams.get("type") || "users";

  if (type === "users") {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        roles: true,
        city: true,
        createdAt: true,
      },
    });

    const headers = ["ID", "Ad", "E-posta", "Telefon", "Roller", "Şehir", "Kayıt Tarihi"];
    const rows = users.map((u) => [
      String(u.id),
      u.name,
      u.email,
      u.phone || "",
      (u.roles as string[]).join(" / "),
      u.city || "",
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
      include: {
        category: true,
        categories: { include: { category: true } },
        user: { select: { name: true, email: true } },
      },
    });

    const headers = [
      "ID", "Firma Adı", "Açıklama", "Ana Kategori", "Tüm Kategoriler",
      "Şehir", "Telefon", "Web Sitesi", "WhatsApp",
      "Puan", "Yorum Sayısı", "Onaylı", "Sahip", "E-posta", "Kayıt Tarihi",
    ];
    const rows = profiles.map((p) => [
      String(p.id),
      p.companyName,
      p.description?.slice(0, 200).replace(/\n/g, " ") || "",
      p.category.name,
      p.categories.map((pc) => pc.category.name).join(" / "),
      p.city,
      p.phone || "",
      p.website || "",
      p.whatsapp || "",
      String(p.ratingAvg),
      String(p.reviewCount),
      p.isVerified ? "Evet" : "Hayır",
      p.user.name,
      p.user.email,
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

  return NextResponse.json({ error: "Geçersiz tip" }, { status: 400 });
}
