import webpush from "web-push";
import { prisma } from "./prisma";

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const subject = process.env.VAPID_SUBJECT || "mailto:noreply@montajimvar.app";

if (publicKey && privateKey) {
  webpush.setVapidDetails(subject, publicKey, privateKey);
}

export { publicKey as VAPID_PUBLIC_KEY };

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
}

export async function sendPush(
  subscription: {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  },
  payload: PushPayload
) {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify(payload),
      { TTL: 86400 } // 24 hours
    );
    return true;
  } catch (error: any) {
    // Gone / expired subscription – remove from DB
    if (error?.statusCode === 410 || error?.statusCode === 404) {
      await prisma.pushSubscription.deleteMany({
        where: { endpoint: subscription.endpoint },
      });
    }
    console.error("Push gönderme hatası:", error?.message || error);
    return false;
  }
}

export async function sendPushToUser(
  userId: number,
  payload: PushPayload
) {
  const subs = await prisma.pushSubscription.findMany({
    where: { userId },
  });

  const results = await Promise.allSettled(
    subs.map((sub) =>
      sendPush(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        payload
      )
    )
  );

  return results.filter((r) => r.status === "fulfilled" && r.value).length;
}
