import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail, verifyEmailHtml } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, role, city } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Ad, e-posta, şifre ve rol zorunludur." },
        { status: 400 }
      );
    }

    const validRoles = ["CUSTOMER", "ASSEMBLER", "MANUFACTURER"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Geçersiz kullanıcı rolü." },
        { status: 400 }
      );
    }

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

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/email-dogrula?token=${verificationToken}`;

    // SMTP yoksa hata fırlatma (console'a log atar)
    await sendEmail({
      to: email,
      subject: "E-posta adresinizi doğrulayın - Montajım Var",
      html: verifyEmailHtml(verifyUrl),
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
