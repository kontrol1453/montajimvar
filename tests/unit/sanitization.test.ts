import { describe, it, expect } from "vitest";
import { sanitizeHTML, sanitizeJSONLD, escapeScriptBody } from "@/lib/sanitize";

describe("Sanitization", () => {
  describe("sanitizeHTML", () => {
    it("strips script tags", () => {
      const result = sanitizeHTML("<script>alert(1)</script><p>safe</p>");
      expect(result).toContain("safe");
      expect(result).not.toContain("script");
      expect(result).not.toContain("alert");
    });

    it("strips onerror handlers", () => {
      const result = sanitizeHTML('<img src="x" onerror="alert(1)">');
      expect(result).not.toContain("onerror");
      expect(result).not.toContain("alert");
    });

    it("preserves Turkish characters", () => {
      const result = sanitizeHTML("<p>Merhaba dünya, Türkçe karakterler: ğüşıöç</p>");
      expect(result).toContain("ğüşıöç");
    });

    it("preserves allowed tags", () => {
      const result = sanitizeHTML("<h1>Title</h1><p>Body</p>");
      expect(result).toContain("<h1>");
      expect(result).toContain("<p>");
    });

    it("strips data attributes", () => {
      const result = sanitizeHTML('<div data-x="evil">content</div>');
      expect(result).not.toContain("data-x");
      expect(result).toContain("content");
    });
  });

  describe("sanitizeJSONLD", () => {
    it("escapes < > &", () => {
      const result = sanitizeJSONLD('{"x":"<script>"}');
      expect(result).not.toContain("<script>");
      expect(result).toContain("\\u003c");
    });
    it("escapes ampersand", () => {
      expect(sanitizeJSONLD("a&b")).toContain("\\u0026");
    });
  });

  describe("escapeScriptBody", () => {
    it("escapes closing script tags", () => {
      const result = escapeScriptBody("if (x) { y = '</script>' }");
      expect(result).not.toContain("</script>");
      expect(result).toContain("<\\/script>");
    });
  });
});
