interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

interface AIResponse {
  content: string;
  model: string;
  usage: { promptTokens: number; completionTokens: number; totalTokens: number };
  latency: number;
}

interface AIProvider {
  name: string;
  chat(messages: Message[], options?: ChatOptions): Promise<AIResponse>;
}

class GeminiProvider implements AIProvider {
  name = "gemini";
  private baseUrl = "https://generativelanguage.googleapis.com/v1beta/models";
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || "";
  }

  get enabled(): boolean {
    return this.apiKey.length > 0;
  }

  async chat(messages: Message[], options?: ChatOptions): Promise<AIResponse> {
    const start = Date.now();
    const model = options?.model || "gemini-1.5-flash";
    const systemMsg = messages.find((m) => m.role === "system");
    const userMsg = messages.find((m) => m.role === "user");

    const parts: { text: string }[] = [];
    if (systemMsg) parts.push({ text: systemMsg.content });
    if (userMsg) parts.push({ text: userMsg.content });

    const res = await fetch(`${this.baseUrl}/${model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": this.apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: options?.temperature ?? 0.3,
          maxOutputTokens: options?.maxTokens ?? 1024,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      throw new Error(`Gemini: ${res.status} ${err.slice(0, 200)}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const usage = data?.usageMetadata || {};

    return {
      content: text,
      model,
      usage: {
        promptTokens: usage.promptTokenCount || 0,
        completionTokens: usage.candidatesTokenCount || 0,
        totalTokens: usage.totalTokenCount || 0,
      },
      latency: Date.now() - start,
    };
  }
}

class RuleBasedProvider implements AIProvider {
  name = "rules";
  async chat(): Promise<AIResponse> {
    throw new Error("RuleBasedProvider does not support chat. Use specific rule functions.");
  }
}

export type AIProviderType = "gemini" | "openai" | "rules";

export function getAIProvider(type?: AIProviderType): AIProvider {
  const provider = type || (process.env.AI_PROVIDER as AIProviderType) || "gemini";
  switch (provider) {
    case "gemini":
      return new GeminiProvider();
    case "openai":
      throw new Error("OpenAI provider not yet implemented");
    case "rules":
      return new RuleBasedProvider();
    default:
      return new GeminiProvider();
  }
}
