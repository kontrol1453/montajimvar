import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name: string;
      email: string;
      roles: string[];
      avatar?: string | null;
    };
  }

  interface User {
    roles: string[];
    avatar?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    roles: string[];
    avatar?: string | null;
  }
}
