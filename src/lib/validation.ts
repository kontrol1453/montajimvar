import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Ad en az 2 karakter olmalı")
    .max(100, "Ad en fazla 100 karakter olabilir")
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s.'-]+$/, "Geçersiz karakter"),
  email: z.string().email("Geçerli bir e-posta adresi girin").max(255),
  password: z
    .string()
    .min(8, "Şifre en az 8 karakter olmalı")
    .max(128, "Şifre en fazla 128 karakter olabilir")
    .regex(/[A-Z]/, "En az bir büyük harf içermeli")
    .regex(/[a-z]/, "En az bir küçük harf içermeli")
    .regex(/[0-9]/, "En az bir rakam içermeli"),
  role: z.enum(["CUSTOMER", "ASSEMBLER", "MANUFACTURER"]),
  phone: z.string().max(30).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
});

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  password: z.string().min(1, "Şifre gerekli"),
});

export const emailSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin").max(255),
});

export const passwordResetSchema = z.object({
  token: z.string().min(1, "Token gerekli"),
  password: z
    .string()
    .min(8, "Şifre en az 8 karakter olmalı")
    .max(128, "Şifre en fazla 128 karakter olabilir")
    .regex(/[A-Z]/, "En az bir büyük harf içermeli")
    .regex(/[a-z]/, "En az bir küçük harf içermeli")
    .regex(/[0-9]/, "En az bir rakam içermeli"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;