import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get("profileId");

  if (!profileId) {
    return NextResponse.json(
      { error: "profileId parametresi zorunludur." },
      { status: 400 }
    );
  }

  try {
    const images = await prisma.profileImage.findMany({
      where: { profileId: Number(profileId) },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error("Profil resimleri hatası:", error);
    return NextResponse.json(
      { error: "Resimler yüklenirken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const { id } = await request.json();

    const image = await prisma.profileImage.findUnique({
      where: { id: Number(id) },
      include: { profile: true },
    });

    if (!image) {
      return NextResponse.json({ error: "Resim bulunamadı." }, { status: 404 });
    }

    if (image.profile.userId !== userId) {
      return NextResponse.json(
        { error: "Bu resmi silme yetkiniz yok." },
        { status: 403 }
      );
    }

    // Delete from Supabase Storage
    // Extract the file path from the URL
    const url = new URL(image.url);
    const pathParts = url.pathname.split("/");
    // The path is after /storage/v1/object/public/images/
    const bucketIndex = pathParts.indexOf("images");
    if (bucketIndex !== -1) {
      const filePath = pathParts.slice(bucketIndex + 1).join("/");
      if (filePath) {
        await supabase.storage.from("images").remove([filePath]);
      }
    }

    // Delete database record
    await prisma.profileImage.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resim silme hatası:", error);
    return NextResponse.json(
      { error: "Resim silinirken hata oluştu." },
      { status: 500 }
    );
  }
}
