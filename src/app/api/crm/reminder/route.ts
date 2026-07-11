import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const { jobId, note } = await request.json();
  if (!jobId) {
    return NextResponse.json({ error: "İş ID gerekli." }, { status: 400 });
  }

  const job = await prisma.job.findUnique({
    where: { id: Number(jobId) },
    include: {
      customer: { select: { name: true, email: true, phone: true } },
    },
  });

  if (!job) {
    return NextResponse.json({ error: "İş bulunamadı." }, { status: 404 });
  }

  if (job.customer.email) {
    await sendEmail({
      to: job.customer.email,
      subject: `Montajım Var - Müşteri Temsilcimiz Sizi Arıyor`,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#0B5FFF;margin-bottom:16px">Merhaba ${job.customer.name},</h2>
        <p style="color:#333;line-height:1.6">Montajım Var müşteri temsilcimiz, <strong>"${job.title}"</strong> işiniz ile ilgili sizi en kısa sürede arayacak.</p>
        ${note ? `<p style="color:#666;font-style:italic;background:#f5f5f5;padding:12px;border-radius:8px">Not: ${note}</p>` : ""}
        <p style="color:#666;font-size:14px;margin-top:24px">Sorularınız için: info@montajimvar.com</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
        <p style="color:#999;font-size:12px">Montajım Var - Profesyonel Montaj Platformu</p>
      </div>`,
    });
  }

  return NextResponse.json({ message: "Hatırlatıcı oluşturuldu, e-posta gönderildi." });
}
