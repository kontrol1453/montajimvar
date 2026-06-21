import type { User, Profile, Category, Message } from "@prisma/client";

export type UserWithProfile = User & {
  profile: Profile & { category: Category } | null;
};

export type ProfileWithCategory = Profile & {
  category: Category;
  user: Pick<User, "id" | "name" | "email" | "phone">;
};

export type MessageWithUsers = Message & {
  sender: Pick<User, "id" | "name">;
  receiver: Pick<User, "id" | "name">;
};

// Form types
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "CUSTOMER" | "ASSEMBLER" | "MANUFACTURER";
  city?: string;
}

export interface ProfileFormData {
  companyName: string;
  description: string;
  categoryId: number;
  city: string;
  address?: string;
  phone?: string;
  website?: string;
}

export interface MessageFormData {
  receiverId: number;
  subject?: string;
  content: string;
}
