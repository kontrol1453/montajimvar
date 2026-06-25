import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const formData = await request.formData();
    const file = (formData as any).get("file") as File | null;
    const profileId = (formData as any).get("profileId") as string | null;
    const isLogo = (formData as any).get("isLogo") === "true";

    if (!file || !profileId) {
      return NextResponse.json(
        { error: "Dosya ve profil ID zorunludur." },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Sadece JPEG, PNG, WebP ve GIF dosyaları kabul edilir." },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Dosya boyutu 5MB'dan küçük olmalıdır." },
        { status: 400 }
      );
    }

    // Check profile ownership
    const profile = await prisma.profile.findUnique({
      where: { id: Number(profileId) },
    });

    if (!profile || profile.userId !== userId) {
      return NextResponse.json(
        { error: "Bu profile dosya yükleme yetkiniz yok." },
        { status: 403 }
      );
    }

    // Upload to Supabase Storage
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${profileId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: "Dosya yüklenirken hata oluştu." },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);

    const url = urlData.publicUrl;

    // If isLogo, update profile logo
    if (isLogo) {
      await prisma.profile.update({
        where: { id: Number(profileId) },
        data: { logo: url },
      });
    }

    // Create image record
    const image = await prisma.profileImage.create({
      data: {
        profileId: Number(profileId),
        url,
        alt: file.name,
        isLogo,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("Dosya yükleme hatası:", error);
    return NextResponse.json(
      { error: "Dosya yüklenirken hata oluştu." },
      { status: 500 }
    );
  }
}

