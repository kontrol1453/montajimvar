import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const { id } = await params;
  const userId = Number(id);
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "all";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 50));

  try {
    const events: Array<{
      id: string;
      type: string;
      subject: string;
      description: string;
      entityType: string;
      entityId: number;
      createdAt: string;
    }> = [];

    const take = limit;

    if (type === "all" || type === "job") {
      const jobs = await prisma.job.findMany({
        where: { customerId: userId },
        orderBy: { createdAt: "desc" },
        take,
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      for (const job of jobs) {
        events.push({
          id: `job-${job.id}`,
          type: "job_created",
          subject: job.title,
          description: `İş oluşturuldu — Durum: ${job.status}`,
          entityType: "job",
          entityId: job.id,
          createdAt: job.createdAt.toISOString(),
        });
      }
    }

    if (type === "all" || type === "message") {
      const messages = await prisma.message.findMany({
        where: { OR: [{ senderId: userId }, { receiverId: userId }] },
        orderBy: { createdAt: "desc" },
        take,
        select: {
          id: true,
          content: true,
          senderId: true,
          createdAt: true,
          sender: { select: { name: true } },
        },
      });
      for (const msg of messages) {
        events.push({
          id: `msg-${msg.id}`,
          type: "message",
          subject: msg.senderId === userId ? "Mesaj gönderildi" : "Mesaj alındı",
          description: msg.content.slice(0, 200),
          entityType: "message",
          entityId: msg.id,
          createdAt: msg.createdAt.toISOString(),
        });
      }
    }

    if (type === "all" || type === "review") {
      const reviews = await prisma.review.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take,
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          profile: { select: { companyName: true } },
        },
      });
      for (const r of reviews) {
        events.push({
          id: `review-${r.id}`,
          type: "review",
          subject: "Yorum bırakıldı",
          description: `${r.rating}/5 — ${r.profile?.companyName || "Bilinmeyen firma"}${r.comment ? `: ${r.comment.slice(0, 100)}` : ""}`,
          entityType: "review",
          entityId: r.id,
          createdAt: r.createdAt.toISOString(),
        });
      }
    }

    if (type === "all" || type === "payment") {
      const payments = await prisma.payment.findMany({
        where: { customerId: userId },
        orderBy: { createdAt: "desc" },
        take,
        select: {
          id: true,
          amount: true,
          status: true,
          createdAt: true,
          job: { select: { title: true } },
        },
      });
      for (const p of payments) {
        events.push({
          id: `payment-${p.id}`,
          type: "payment",
          subject: `Ödeme ${p.status === "released" ? "serbest bırakıldı" : "bekliyor"}`,
          description: `${Number(p.amount).toLocaleString("tr-TR")}₺ — ${p.job?.title || "İş"}`,
          entityType: "payment",
          entityId: p.id,
          createdAt: p.createdAt.toISOString(),
        });
      }
    }

    events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const total = events.length;
    const paged = events.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      events: paged,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("CRM timeline error:", error);
    return NextResponse.json(
      { error: "Zaman çizelgesi yüklenirken hata oluştu." },
      { status: 500 }
    );
  }
}
