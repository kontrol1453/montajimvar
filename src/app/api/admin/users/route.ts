import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  try {
    const { name, email, password, roles } = await request.json();

    if (!name || !email || !password || !roles || !Array.isArray(roles) || roles.length === 0) {
      return NextResponse.json(
        { error: "Ad, e-posta, şifre ve en az bir rol zorunludur." },
        { status: 400 }
      );
    }

    const validRoles = ["CUSTOMER", "ASSEMBLER", "MANUFACTURER", "ADMIN"];
    const invalid = roles.filter((r: string) => !validRoles.includes(r));
    if (invalid.length > 0) {
      return NextResponse.json(
        { error: `Geçersiz roller: ${invalid.join(", ")}` },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalıdır." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kayıtlı." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, roles },
      select: { id: true, name: true, email: true, roles: true, createdAt: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Admin kullanıcı oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Kullanıcı oluşturulurken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  try {
    const { id } = await request.json();

    // Don't allow deleting self
    if (id === (session.user as any).id) {
      return NextResponse.json(
        { error: "Kendinizi silemezsiniz." },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Kullanıcı silme hatası:", error);
    return NextResponse.json(
      { error: "Kullanıcı silinirken hata oluştu." },
      { status: 500 }
    );
  }
}

