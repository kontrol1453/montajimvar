import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendEmail, resetPasswordHtml } from "@/lib/email";
import { emailSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const parsed = emailSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json({ error: "Geçerli bir e-posta adresi girin" }, { status: 400 });
    }

    const { email } = parsed.data;

    // Check if user exists (don't reveal)
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "E-posta adresiniz varsa şifre sıfırlama linki gönderilecektir.",
      });
    }

    // Delete old tokens
    await prisma.passwordResetToken.deleteMany({ where: { email } });

    // Create new token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: { email, token, expiresAt },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/sifre-sifirla?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Şifre sıfırlama - Montajım Var",
      html: resetPasswordHtml(resetUrl),
    });

    return NextResponse.json({
      success: true,
      message: "E-posta adresiniz varsa şifre sıfırlama linki gönderilecektir.",
    });
  } catch (error) {
    console.error("Şifre sıfırlama hatası:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
