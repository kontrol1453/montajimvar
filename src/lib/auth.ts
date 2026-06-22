import { AuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import crypto from "crypto";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("E-posta ve şifre gerekli");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Bu e-posta ile kayıtlı kullanıcı bulunamadı");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Hatalı şifre");
        }

        if (!user.emailVerified) {
          throw new Error("E-posta adresiniz doğrulanmamış. Lütfen e-postanızı kontrol edin.");
        }

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

        if (!existingUser) {
          const randomPassword = crypto.randomBytes(32).toString("hex");
          const hashedPassword = await bcrypt.hash(randomPassword, 12);

          const newUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || profile?.name || "Google User",
              avatar: user.image || (profile as any)?.picture,
              roles: ["CUSTOMER"],
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
          (user as any).id = existingUser.id;
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
      }
      // Normalise eski JWT token'lardaki string ID'leri (Prisma Int uyumu)
      if (typeof token.id === "string") {
        token.id = Number(token.id) || 0;
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
  },
  secret: process.env.NEXTAUTH_SECRET || "montajimvar-gizli-anahtar-degistirin",
};

export async function auth() {
  return getServerSession(authOptions);
}
