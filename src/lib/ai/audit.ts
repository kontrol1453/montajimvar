interface AIAuditEntry {
  userId?: number;
  promptId: string;
  promptVersion: string;
  provider: string;
  model: string;
  inputLength: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  latency: number;
  success: boolean;
  error?: string;
  cached?: boolean;
  hasPII?: boolean;
  injectionAttempt?: boolean;
}

export async function logAIAudit(entry: AIAuditEntry): Promise<void> {
  try {
    if (process.env.AI_AUDIT_ENABLED !== "false") {
      const payload = {
        ...entry,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
      };

      if (process.env.NODE_ENV === "development") {
        console.log("[AI AUDIT]", JSON.stringify(payload, null, 2));
      }

      if (typeof globalThis !== "undefined" && "aiAuditLog" in globalThis) {
        const queue: AIAuditEntry[] = (globalThis as any).aiAuditLog || [];
        queue.push(entry);
        (globalThis as any).aiAuditLog = queue;
      }
    }
  } catch {
    // Silently fail — audit should never break the main flow
  }
}
