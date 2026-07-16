import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema, emailSchema, passwordResetSchema } from "@/lib/validation";

describe("Auth Validation Schemas", () => {
  describe("registerSchema", () => {
    it("accepts valid registration data", () => {
      const result = registerSchema.safeParse({
        name: "Ahmet Yılmaz",
        email: "ahmet@example.com",
        password: "StrongPass1",
        role: "CUSTOMER",
        phone: "+90 532 123 4567",
        city: "İstanbul",
      });
      expect(result.success).toBe(true);
    });

    it("rejects short password", () => {
      const result = registerSchema.safeParse({
        name: "Ahmet",
        email: "ahmet@example.com",
        password: "weak",
        role: "CUSTOMER",
      });
      expect(result.success).toBe(false);
    });

    it("rejects password without uppercase", () => {
      const result = registerSchema.safeParse({
        name: "Ahmet",
        email: "ahmet@example.com",
        password: "strongpass1",
        role: "CUSTOMER",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid role", () => {
      const result = registerSchema.safeParse({
        name: "Ahmet",
        email: "ahmet@example.com",
        password: "StrongPass1",
        role: "INVALID_ROLE",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid email", () => {
      const result = registerSchema.safeParse({
        name: "Ahmet",
        email: "not-an-email",
        password: "StrongPass1",
        role: "CUSTOMER",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("loginSchema", () => {
    it("accepts valid login", () => {
      const result = loginSchema.safeParse({ email: "user@test.com", password: "any" });
      expect(result.success).toBe(true);
    });

    it("rejects empty password", () => {
      const result = loginSchema.safeParse({ email: "user@test.com", password: "" });
      expect(result.success).toBe(false);
    });

    it("rejects invalid email", () => {
      const result = loginSchema.safeParse({ email: "nope", password: "pass" });
      expect(result.success).toBe(false);
    });
  });

  describe("emailSchema", () => {
    it("accepts valid email", () => {
      expect(emailSchema.safeParse({ email: "x@y.com" }).success).toBe(true);
    });
    it("rejects missing email", () => {
      expect(emailSchema.safeParse({}).success).toBe(false);
    });
  });

  describe("passwordResetSchema", () => {
    it("accepts valid reset", () => {
      expect(passwordResetSchema.safeParse({ token: "abc", password: "Strong1Pass" }).success).toBe(true);
    });
    it("rejects weak password", () => {
      expect(passwordResetSchema.safeParse({ token: "abc", password: "weak" }).success).toBe(false);
    });
    it("rejects missing token", () => {
      expect(passwordResetSchema.safeParse({ password: "Strong1Pass" }).success).toBe(false);
    });
  });
});
