import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Send a message
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const senderId = (session.user as any).id;

  try {
    const { profileId, subject, content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Mesaj içeriği zorunludur." },
        { status: 400 }
      );
    }

    // Get the profile owner
    const profile = await prisma.profile.findUnique({
      where: { id: Number(profileId) },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Firma profili bulunamadı." },
        { status: 404 }
      );
    }

    if (profile.userId === senderId) {
      return NextResponse.json(
        { error: "Kendinize mesaj gönderemezsiniz." },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId: profile.userId,
        subject: subject || "",
        content,
      },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Mesaj hatası:", error);
    return NextResponse.json(
      { error: "Mesaj gönderilirken hata oluştu." },
      { status: 500 }
    );
  }
}

// Get messages (inbox/sent)
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "inbox";

  try {
    let messages;
    if (type === "sent") {
      messages = await prisma.message.findMany({
        where: { senderId: userId },
        orderBy: { createdAt: "desc" },
        include: {
          sender: { select: { id: true, name: true } },
          receiver: { select: { id: true, name: true } },
        },
      });
    } else {
      messages = await prisma.message.findMany({
        where: { receiverId: userId },
        orderBy: { createdAt: "desc" },
        include: {
          sender: { select: { id: true, name: true } },
          receiver: { select: { id: true, name: true } },
        },
      });
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Mesaj listesi hatası:", error);
    return NextResponse.json(
      { error: "Mesajlar yüklenirken hata oluştu." },
      { status: 500 }
    );
  }
}
