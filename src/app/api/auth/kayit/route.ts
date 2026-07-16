import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail, verifyEmailHtml } from "@/lib/email";
import { notifyAdmin } from "@/lib/notifications";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const parsed = registerSchema.safeParse(rawBody);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      const firstError = Object.values(errors).flat()[0] || "Geçersiz veri";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, password, phone, role, city } = parsed.data;
    const roles = [role];

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kayıtlı." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        roles,
        city,
      },
      select: {
        id: true,
        name: true,
        email: true,
        roles: true,
      },
    });

    // E-posta doğrulama token'ı oluştur ve gönder
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 saat

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: expiresAt,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const verifyUrl = `${appUrl}/auth/email-dogrula?token=${verificationToken}`;

    // SMTP yoksa hata fırlatma (console'a log atar)
    await sendEmail({
      to: email,
      subject: "E-posta adresinizi doğrulayın - Montajım Var",
      html: verifyEmailHtml(verifyUrl),
    });

    // Admin bildirimi
    await notifyAdmin({
      type: "new_user",
      title: "Yeni Kullanıcı Kaydı",
      message: `${name} (${email}) - ${role}`,
      link: "/admin/kullanicilar",
    });

    return NextResponse.json(
      { 
        message: "Kayıt başarılı. E-posta adresinize doğrulama linki gönderildi.",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Kayıt hatası:", error);
    return NextResponse.json(
      { error: "Kayıt sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
