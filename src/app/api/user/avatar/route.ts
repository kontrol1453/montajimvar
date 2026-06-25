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

    if (!file) {
      return NextResponse.json({ error: "Dosya gerekli." }, { status: 400 });
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Sadece JPEG, PNG, WebP ve GIF dosyaları kabul edilir." },
        { status: 400 }
      );
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Dosya boyutu 2MB'dan küçük olmalıdır." },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `avatars/${userId}-${Date.now()}.${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase avatar upload error:", uploadError);
      return NextResponse.json(
        { error: "Avatar yüklenirken hata oluştu." },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);

    const url = urlData.publicUrl;

    // Update user avatar
    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatar: url },
      select: { id: true, name: true, email: true, avatar: true },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Avatar yükleme hatası:", error);
    return NextResponse.json(
      { error: "Avatar yüklenirken hata oluştu." },
      { status: 500 }
    );
  }
}

