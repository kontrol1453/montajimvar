import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const { password } = await request.json();

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalıdır." },
        { status: 400 }
      );
    }

    // Find token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Geçersiz veya süresi dolmuş şifre sıfırlama bağlantısı." },
        { status: 400 }
      );
    }

    if (new Date() > resetToken.expiresAt) {
      await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
      return NextResponse.json(
        { error: "Bu bağlantının süresi dolmuş. Lütfen yeni bir şifre sıfırlama talebi oluşturun." },
        { status: 400 }
      );
    }

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    });

    // Delete used tokens
    await prisma.passwordResetToken.deleteMany({
      where: { email: resetToken.email },
    });

    return NextResponse.json({
      success: true,
      message: "Şifreniz başarıyla güncellendi. Giriş yapabilirsiniz.",
    });
  } catch (error) {
    console.error("Şifre sıfırlama hatası:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
