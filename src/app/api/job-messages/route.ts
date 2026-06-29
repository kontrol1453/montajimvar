import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/job-messages?jobId=123 - List messages for a job
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { searchParams } = new URL(request.url);
  const jobId = Number(searchParams.get("jobId"));

  if (!jobId) {
    return NextResponse.json({ error: "jobId gerekli." }, { status: 400 });
  }

  // Job'a erişim yetkisi kontrolü (customer veya artisan)
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { customerId: true, offers: { where: { status: "accepted" }, select: { artisanId: true } } },
  });

  if (!job) {
    return NextResponse.json({ error: "İş bulunamadı." }, { status: 404 });
  }

  const isCustomer = job.customerId === userId;
  const isAssignedArtisan = job.offers.some((o) => o.artisanId === userId);

  if (!isCustomer && !isAssignedArtisan) {
    return NextResponse.json({ error: "Bu işin mesajlarını görüntüleme yetkiniz yok." }, { status: 403 });
  }

  const messages = await prisma.jobMessage.findMany({
    where: { jobId },
    include: {
      sender: { select: { id: true, name: true, avatar: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  // Kendi mesajlarını okundu olarak işaretle
  await prisma.jobMessage.updateMany({
    where: { jobId, senderId: { not: userId }, isRead: false },
    data: { isRead: true },
  });

  return NextResponse.json(messages);
}

// POST /api/job-messages - Send a message on a job
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const { jobId, message, fileUrl } = await request.json();

    if (!jobId || !message) {
      return NextResponse.json({ error: "jobId ve mesaj zorunludur." }, { status: 400 });
    }

    // Job'a erişim yetkisi kontrolü
    const job = await prisma.job.findUnique({
      where: { id: Number(jobId) },
      select: { customerId: true, offers: { where: { status: "accepted" }, select: { artisanId: true } } },
    });

    if (!job) {
      return NextResponse.json({ error: "İş bulunamadı." }, { status: 404 });
    }

    const isCustomer = job.customerId === userId;
    const isAssignedArtisan = job.offers.some((o) => o.artisanId === userId);

    if (!isCustomer && !isAssignedArtisan) {
      return NextResponse.json({ error: "Bu işe mesaj gönderme yetkiniz yok." }, { status: 403 });
    }

    const jobMessage = await prisma.jobMessage.create({
      data: {
        jobId: Number(jobId),
        senderId: userId,
        message,
        fileUrl: fileUrl || null,
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
    });

    return NextResponse.json(jobMessage, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}
