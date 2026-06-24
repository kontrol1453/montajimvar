import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles?.includes("ADMIN")) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const userId = Number(id);
    const { roles } = await request.json();

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      return NextResponse.json(
        { error: "En az bir rol seçilmelidir." },
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

    await prisma.user.update({
      where: { id: userId },
      data: { 
        roles,
        tokenVersion: { increment: 1 }
      },
    });

    revalidatePath("/admin/kullanicilar");

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, roles: true, tokenVersion: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Rol güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Roller güncellenirken hata oluştu." },
      { status: 500 }
    );
  }
}
