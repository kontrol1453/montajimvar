import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "E-posta gerekli" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ success: true, message: "E-posta zaten doğrulanmış" });
    }

    // Generate verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.user.update({
      where: { email },
      data: {
        emailVerificationToken: token,
        emailVerificationExpires: expiresAt,
      },
    });

    // TODO: Send actual email
    // For now, log the verification link for development
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/email-dogrula?token=${token}`;
    console.log(`[DEV] Email verification link for ${email}: ${verifyUrl}`);

    // In production, you would send an email here using a service like:
    // - Nodemailer with SMTP
    // - Resend
    // - SendGrid
    // - Mailgun

    return NextResponse.json({
      success: true,
      message: "Doğrulama e-postası gönderildi",
      // Only include in development
      ...(process.env.NODE_ENV === "development" && { devUrl: verifyUrl }),
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
