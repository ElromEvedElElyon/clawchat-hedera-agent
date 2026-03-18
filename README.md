# ClawChat Hedera Agent

**Autonomous AI Agent Infrastructure on Hedera Hashgraph**

A multi-agent system where AI agents autonomously transact, coordinate, and exchange value on Hedera — built for the agent-native economy.

## The Problem

AI agents today lack a trustless, low-cost infrastructure for autonomous commerce. Current solutions are either too expensive (Ethereum gas), too slow (Bitcoin finality), or too centralized (traditional APIs). There is no standard protocol for agents to discover, negotiate, and transact with each other.

## The Solution

ClawChat Hedera Agent provides:

- **Agent-to-Agent Commerce** — Autonomous HBAR transfers and HTS token operations without human intervention
- **HCS-10 Messaging Protocol** — Agent discovery, service requests, and capability broadcasting via Hedera Consensus Service
- **Multi-LLM Routing** — Parallel AI racing across 8 providers (Claude, GPT-4, Gemini, DeepSeek, Grok, Perplexity, Manus, OpenClaw) with first-response-wins architecture
- **Natural Language DeFi** — Users interact in plain English; agents execute on-chain
- **ClawChat PWA Interface** — Zero-install web app showing agent flow states and autonomous behavior

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   ClawChat PWA                       │
│          (sintex.ai/clawchat.html)                  │
│    8 LLM Providers · Agent Panel · MCP Manager      │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────┐
│              ClawChat Bridge                         │
│    NL Router · Multi-LLM Race · Command Parser      │
└───────┬─────────────────────────────────┬───────────┘
        │                                 │
┌───────▼───────────┐      ┌─────────────▼───────────┐
│   Hedera Agent    │      │    HCS-10 Messaging     │
│ · HBAR Transfer   │      │ · Agent Discovery       │
│ · Token Create    │      │ · Service Requests      │
│ · Balance Query   │      │ · Capability Broadcast  │
│ · Token Associate │      │ · Topic Management      │
└───────┬───────────┘      └─────────────┬───────────┘
        │                                 │
┌───────▼─────────────────────────────────▼───────────┐
│              Hedera Hashgraph                        │
│   10,000 TPS · $0.0001 fees · 3-5s finality        │
│   HTS · HCS · EVM · Smart Contracts                │
└─────────────────────────────────────────────────────┘
```

## Features

### Hedera Agent
- **HBAR Operations**: Balance queries, transfers between accounts
- **Token Management**: Create HTS tokens (fungible), associate tokens to accounts
- **Natural Language Processing**: Parse commands like "transfer 5 HBAR to 0.0.12345"
- **Network Support**: Testnet and Mainnet

### HCS-10 Protocol (Agent-to-Agent)
- **Topic Management**: Create and manage Consensus Service topics
- **Agent Discovery**: Broadcast capabilities to the network
- **Service Requests**: Request/response pattern between agents
- **Real-time Subscriptions**: Listen for incoming messages

### ClawChat Bridge
- **Multi-LLM Routing**: Routes to Hedera agent for on-chain ops, LLMs for general queries
- **8 Providers**: Pollinations, Puter.js, LLM7.io, Ollama + ChatGPT, Claude, Gemini, Grok
- **Parallel Racing**: First response wins (~3x faster than single provider)
- **Conversation History**: Maintains context across messages

## Quick Start

```bash
# Clone
git clone https://github.com/ElromEvedElElyon/clawchat-hedera-agent.git
cd clawchat-hedera-agent

# Install
npm install

# Configure
cp .env.example .env
# Edit .env with your Hedera testnet credentials

# Build & Run
npm run build
npm start
```

### Environment Variables

```env
HEDERA_ACCOUNT_ID=0.0.xxxxx
HEDERA_PRIVATE_KEY=302e...
HEDERA_NETWORK=testnet
AGENT_NAME=ClawChat DeFi Assistant
AGENT_ID=clawchat-hedera-001
CLAWCHAT_URL=https://sintex.ai/clawchat.html
```

### Get Testnet Credentials

1. Go to [portal.hedera.com](https://portal.hedera.com)
2. Create a testnet account
3. Copy your Account ID and Private Key

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Language | TypeScript / Node.js |
| Blockchain | Hedera Hashgraph SDK v2.51+ |
| AI | 8 LLM providers (parallel racing) |
| Frontend | ClawChat PWA (vanilla HTML/JS) |
| Protocol | HCS-10 (agent-to-agent messaging) |
| Orchestration | OpenClaw multi-agent framework |

## Tracks

- **AI & Agents** (primary) — Autonomous agent marketplace and coordination layer
- **OpenClaw Bounty** — Agent-native application for the agentic society

## Live Demo

- **ClawChat PWA**: [sintex.ai/clawchat.html](https://sintex.ai/clawchat.html)
- **Agent Demo**: [sintex.ai/hedera-demo.html](https://sintex.ai/hedera-demo.html)

## Why Hedera for AI Agents

| Metric | Hedera | Ethereum | Solana |
|--------|--------|----------|--------|
| TPS | 10,000 | ~30 | ~4,000 |
| Avg Fee | $0.0001 | $2-50 | $0.00025 |
| Finality | 3-5s | 12-15min | ~400ms |
| Agent-scale? | Yes | No | Maybe |

Hedera's hashgraph consensus is purpose-built for high-frequency, low-value agent transactions — the backbone of autonomous commerce.

## Team

**Elrom Eved El Elyon** — Solo builder
- Full-stack AI/blockchain developer
- Builder of ClawChat PWA, OpenClaw integrations, MCP servers
- 10+ years software engineering

## Built For

[Hedera Hello Future: Apex Hackathon 2026](https://hellofuturehackathon.dev/) — $250K prize pool

## License

MIT
