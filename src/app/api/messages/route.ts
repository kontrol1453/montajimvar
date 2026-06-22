import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Send a message (profileId = to profile owner, receiverId = direct reply)
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const senderId = (session.user as any).id;

  try {
    const { profileId, receiverId, subject, content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Mesaj içeriği zorunludur." },
        { status: 400 }
      );
    }

    let targetUserId: number;

    if (profileId) {
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
      targetUserId = profile.userId;
    } else if (receiverId) {
      targetUserId = Number(receiverId);
      if (targetUserId === senderId) {
        return NextResponse.json(
          { error: "Kendinize mesaj gönderemezsiniz." },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Alıcı belirtilmedi." },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId: targetUserId,
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

// Get messages (inbox/sent/conversation)
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "inbox";
  const conversationWith = searchParams.get("conversationWith");

  try {
    if (conversationWith) {
      const otherId = Number(conversationWith);
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId, receiverId: otherId },
            { senderId: otherId, receiverId: userId },
          ],
        },
        orderBy: { createdAt: "asc" },
        include: {
          sender: { select: { id: true, name: true, avatar: true } },
          receiver: { select: { id: true, name: true, avatar: true } },
        },
      });
      return NextResponse.json(messages);
    }

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

