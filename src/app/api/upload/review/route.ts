import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = Number((session.user as any).id);

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as unknown as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "En az bir dosya gerekli." }, { status: 400 });
    }

    if (files.length > 5) {
      return NextResponse.json({ error: "En fazla 5 fotoğraf yükleyebilirsiniz." }, { status: 400 });
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Sadece JPEG, PNG, WebP ve GIF dosyaları kabul edilir." },
          { status: 400 }
        );
      }
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Dosya boyutu 5MB'dan küçük olmalıdır." },
          { status: 400 }
        );
      }
    }

    const urls: string[] = [];

    for (const file of files) {
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `reviews/${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

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
        console.error("Supabase upload error:", uploadError);
        return NextResponse.json(
          { error: "Dosya yüklenirken hata oluştu." },
          { status: 500 }
        );
      }

      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

      urls.push(urlData.publicUrl);
    }

    return NextResponse.json({ urls }, { status: 201 });
  } catch (error) {
    console.error("Review fotoğraf yükleme hatası:", error);
    return NextResponse.json(
      { error: "Dosya yüklenirken hata oluştu." },
      { status: 500 }
    );
  }
}
