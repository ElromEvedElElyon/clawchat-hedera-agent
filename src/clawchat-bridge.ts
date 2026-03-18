import { HederaAgent } from "./agent.js";
import { HCS10Messaging, HCS10Message } from "./hcs10.js";

export interface ClawChatConfig {
  agentName: string;
  agentId: string;
  llmProviders: string[];
  clawchatUrl: string;
}

export class ClawChatBridge {
  private agent: HederaAgent;
  private messaging: HCS10Messaging | null = null;
  private config: ClawChatConfig;
  private conversationHistory: Array<{ role: string; content: string }> = [];

  constructor(agent: HederaAgent, config: ClawChatConfig) {
    this.agent = agent;
    this.config = config;
  }

  async processUserMessage(message: string): Promise<string> {
    this.conversationHistory.push({ role: "user", content: message });

    // Check if it's a Hedera command
    const hederaKeywords = [
      "balance", "transfer", "send", "hbar", "token",
      "create token", "mint", "network", "status", "hedera",
    ];

    const isHederaCommand = hederaKeywords.some((k) =>
      message.toLowerCase().includes(k)
    );

    let response: string;

    if (isHederaCommand) {
      response = await this.agent.processCommand(message);
    } else {
      // Route to AI for general conversation
      response = await this.getAIResponse(message);
    }

    this.conversationHistory.push({ role: "assistant", content: response });
    return response;
  }

  private async getAIResponse(message: string): Promise<string> {
    // Multi-LLM routing: try providers in order
    for (const provider of this.config.llmProviders) {
      try {
        const response = await this.callLLM(provider, message);
        if (response) return `[${provider}] ${response}`;
      } catch {
        continue;
      }
    }

    return this.getFallbackResponse(message);
  }

  private async callLLM(
    provider: string,
    message: string
  ): Promise<string | null> {
    const systemPrompt = `You are ${this.config.agentName}, a DeFi assistant powered by Hedera.
You can help with: HBAR transfers, token creation, balance queries, and general crypto questions.
Be concise and helpful. When users ask about Hedera operations, guide them to use natural language commands.`;

    // Provider-specific endpoints
    const endpoints: Record<string, string> = {
      pollinations: "https://text.pollinations.ai/openai",
      puter: "https://js.puter.com/v2/",
      llm7: "https://api.llm7.io/v1/chat/completions",
    };

    const endpoint = endpoints[provider];
    if (!endpoint) return null;

    if (provider === "pollinations") {
      const resp = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai",
          messages: [
            { role: "system", content: systemPrompt },
            ...this.conversationHistory.slice(-6),
            { role: "user", content: message },
          ],
        }),
      });

      if (!resp.ok) return null;
      const data = await resp.json();
      return data.choices?.[0]?.message?.content || null;
    }

    return null;
  }

  private getFallbackResponse(message: string): string {
    const lower = message.toLowerCase();

    if (lower.includes("help") || lower.includes("what can you do")) {
      return [
        `I'm ${this.config.agentName}, your DeFi assistant!`,
        "",
        "I can help you with:",
        "- Check HBAR balance",
        "- Transfer HBAR between accounts",
        "- Create new tokens (HTS)",
        "- Monitor network status",
        "- Agent-to-agent messaging (HCS-10)",
        "",
        "Try: 'What is my HBAR balance?' or 'Transfer 10 HBAR to 0.0.12345'",
      ].join("\n");
    }

    if (lower.includes("hello") || lower.includes("hi")) {
      return `Hello! I'm ${this.config.agentName}, powered by Hedera + ClawChat. How can I help you with DeFi today?`;
    }

    return `I'm not sure how to help with that. Try asking about HBAR balance, transfers, or token creation. Say 'help' for more options.`;
  }

  getConversationHistory(): Array<{ role: string; content: string }> {
    return [...this.conversationHistory];
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }
}
