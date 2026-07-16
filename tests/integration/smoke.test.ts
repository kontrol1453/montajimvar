import { describe, it, expect } from "vitest";

describe("Smoke Tests — Health endpoint contract", () => {
  it("returns a valid health response shape", () => {
    const sample = {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "montajimvar",
      version: "0.1.0",
    };
    expect(sample.status).toBe("ok");
    expect(sample.service).toBe("montajimvar");
    expect(typeof sample.timestamp).toBe("string");
    expect(sample.version).toMatch(/^\d+\.\d+\.\d+/);
  });
});
