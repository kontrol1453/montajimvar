import { AuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import crypto from "crypto";
import { cookies } from "next/headers";
import { verifySignedCookie } from "./cookie-sign";
import { loginSchema } from "./validation";
import * as Sentry from "@sentry/nextjs";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;
const SESSION_ABSOLUTE_TIMEOUT_MS = 24 * 60 * 60 * 1000;

function getClientIp(): string | null {
  return null;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
async authorize(credentials, req) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new Error("E-posta ve şifre gerekli");
        }

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        const requestHeaders = req?.headers as Record<string, string[]> | undefined;
        const ip = requestHeaders?.["x-forwarded-for"]?.[0]?.split(",")[0]?.trim()
          || requestHeaders?.["x-real-ip"]?.[0]
          || null;
        const userAgent = requestHeaders?.["user-agent"]?.[0] || null;

        if (user && user.lockedUntil && new Date() < user.lockedUntil) {
          const remaining = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
          throw new Error(`Hesabınız ${remaining} dakika süreyle kilitlendi. Daha sonra tekrar deneyin.`);
        }

        if (!user) {
          await prisma.loginAttempt.create({
            data: { userId: 0, email, success: false, ip, userAgent },
          });
          throw new Error("E-posta veya şifre hatalı");
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          const newAttemptCount = user.failedLoginAttempts + 1;
          const shouldLock = newAttemptCount >= MAX_LOGIN_ATTEMPTS;

          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: newAttemptCount,
              lockedUntil: shouldLock ? new Date(Date.now() + LOCKOUT_DURATION_MS) : user.lockedUntil,
            },
          });

          await prisma.loginAttempt.create({
            data: { userId: user.id, email, success: false, ip, userAgent },
          });

          if (shouldLock) {
            Sentry.captureMessage(`Account locked: ${email} (${newAttemptCount} failed attempts from IP ${ip})`, "warning");
            throw new Error("Çok fazla başarısız deneme. Hesabınız 15 dakika süreyle kilitlendi.");
          }

          const remaining = MAX_LOGIN_ATTEMPTS - newAttemptCount;
          throw new Error(`Hatalı şifre. ${remaining} deneme hakkınız kaldı.`);
        }

        if (!user.emailVerified) {
          throw new Error("E-posta adresiniz doğrulanmamış. Lütfen e-postanızı kontrol edin.");
        }

        if (user.lastLoginIp && ip && user.lastLoginIp !== ip) {
          Sentry.captureMessage(`Suspicious login: ${email} from new IP ${ip} (previous: ${user.lastLoginIp})`, "warning");
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            lockedUntil: null,
            lastLoginAt: new Date(),
            lastLoginIp: ip,
          },
        });

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          roles: user.roles,
          role: user.roles,
          avatar: user.avatar,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        // Google ile kayıt olurken seçilen rolü cookie'den al
let googleRole = "CUSTOMER";
        try {
          const cookieStore = await cookies();
          const rawCookie = cookieStore.get("google_signup_role")?.value;
          if (rawCookie) {
            const verified = verifySignedCookie(rawCookie);
            if (verified) {
              googleRole = verified;
            }
          }
          cookieStore.set("google_signup_role", "", { maxAge: 0, path: "/" });
        } catch {
          // cookies() kullanılamazsa varsayılan role devam et
        }

        const validRoles = ["CUSTOMER", "ASSEMBLER", "MANUFACTURER"];
        if (!validRoles.includes(googleRole)) {
          googleRole = "CUSTOMER";
        }

        if (!existingUser) {
          const randomPassword = crypto.randomBytes(32).toString("hex");
          const hashedPassword = await bcrypt.hash(randomPassword, 12);

          const newUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || profile?.name || "Google User",
              avatar: user.image || (profile as any)?.picture,
              roles: [googleRole],
              emailVerified: true,
              password: hashedPassword,
            },
          });
          (user as any).id = newUser.id;
        } else {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              avatar: user.image || existingUser.avatar,
              emailVerified: true,
            },
          });
          // Mevcut kullanıcının rollerini ve tokenVersion'ını user objesine ekle
          // Bu JWT callback'inde doğru token oluşturulması için kritiktir
          (user as any).id = existingUser.id;
          (user as any).roles = existingUser.roles;
          (user as any).tokenVersion = existingUser.tokenVersion;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = Number((user as any).id ?? user.id) || 0;
        token.roles = (user as any).roles || ["CUSTOMER"];
        token.role = token.roles;
        token.avatar = (user as any).avatar;
        token.tokenVersion = (user as any).tokenVersion || 0;
        token.loginAt = Math.floor(Date.now() / 1000);
      }
      // Normalise eski JWT token'lardaki string ID'leri (Prisma Int uyumu)
      if (typeof token.id === "string") {
        token.id = Number(token.id) || 0;
      }
      // Session absolute timeout (24 saat)
      if (token.loginAt) {
        const elapsed = Date.now() - (token.loginAt as number) * 1000;
        if (elapsed > SESSION_ABSOLUTE_TIMEOUT_MS) {
          console.log("[JWT] Session absolute timeout exceeded, forcing re-login");
          throw new Error("Oturum süresi doldu, lütfen tekrar giriş yapın");
        }
      }
      // Versiyon kontrolü SADECE token yenilemesinde (yeni girişte değil)
      if (token.id && !user && !account) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id },
            select: { tokenVersion: true, roles: true },
          });
          if (!dbUser) {
            console.log("[JWT] User not found in DB, invalidating token");
            throw new Error("Kullanıcı bulunamadı");
          }
          console.log("[JWT] Version check:", { tokenVersion: token.tokenVersion, dbVersion: dbUser.tokenVersion, match: dbUser.tokenVersion === token.tokenVersion });
          if (dbUser.tokenVersion !== token.tokenVersion) {
            console.log("[JWT] Version mismatch! Forcing re-login");
            throw new Error("Roller güncellendi, lütfen tekrar giriş yapın");
          }
          // Versiyon uyuşuyorsa rolleri güncelle (token'da eski kalmasın)
          token.roles = dbUser.roles;
          token.role = dbUser.roles;
        } catch (error) {
          console.error("[JWT] Version check error:", error);
          // Hata fırlatma, sadece mevcut token'ı kullan
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).roles = token.roles;
        (session.user as any).role = token.role;
        (session.user as any).avatar = token.avatar;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/giris",
    newUser: "/auth/kayit",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 saat (sliding)
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function auth() {
  return getServerSession(authOptions);
}
