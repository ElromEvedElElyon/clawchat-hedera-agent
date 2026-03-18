import { HederaAgent } from "./agent.js";
import { ClawChatBridge } from "./clawchat-bridge.js";
import { config } from "dotenv";

config();

async function main() {
  console.log("=== ClawChat Hedera Agent v1.0 ===");
  console.log("Multi-LLM DeFi Assistant powered by Hedera + ClawChat PWA\n");

  // Initialize Hedera Agent
  const agent = new HederaAgent({
    accountId: process.env.HEDERA_ACCOUNT_ID || "0.0.0",
    privateKey: process.env.HEDERA_PRIVATE_KEY || "",
    network:
      (process.env.HEDERA_NETWORK as "testnet" | "mainnet") || "testnet",
  });

  await agent.initialize();

  // Initialize ClawChat Bridge
  const bridge = new ClawChatBridge(agent, {
    agentName: process.env.AGENT_NAME || "ClawChat DeFi Assistant",
    agentId: process.env.AGENT_ID || "clawchat-hedera-001",
    llmProviders: ["pollinations", "puter", "llm7"],
    clawchatUrl:
      process.env.CLAWCHAT_URL || "https://sintex.ai/clawchat.html",
  });

  // Demo: show capabilities
  console.log("Agent Capabilities:");
  for (const cap of agent.getCapabilities()) {
    console.log(`  - ${cap}`);
  }

  // Demo: process commands through ClawChat bridge
  const demoMessages = [
    "Hello! What can you do?",
    "What is my HBAR balance?",
    "Show me the current network status",
    "Transfer 5 HBAR to 0.0.12345",
  ];

  console.log("\n--- Demo Conversation ---\n");

  for (const msg of demoMessages) {
    console.log(`User: ${msg}`);
    const response = await bridge.processUserMessage(msg);
    console.log(`Agent: ${response}\n`);
  }

  console.log("=== Agent Ready ===");
  console.log(
    `Connect via ClawChat PWA: ${process.env.CLAWCHAT_URL || "https://sintex.ai/clawchat.html"}`
  );
}

main().catch(console.error);
