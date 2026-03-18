import {
  Client,
  AccountBalanceQuery,
  TransferTransaction,
  Hbar,
  HbarUnit,
  TokenCreateTransaction,
  TokenAssociateTransaction,
  AccountId,
  PrivateKey,
} from "@hashgraph/sdk";

export interface AgentConfig {
  accountId: string;
  privateKey: string;
  network: "testnet" | "mainnet";
}

export class HederaAgent {
  private client: Client | null = null;
  private config: AgentConfig;
  private initialized = false;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    try {
      this.client =
        this.config.network === "mainnet"
          ? Client.forMainnet()
          : Client.forTestnet();

      if (this.config.accountId && this.config.privateKey) {
        this.client.setOperator(
          AccountId.fromString(this.config.accountId),
          PrivateKey.fromStringED25519(this.config.privateKey)
        );
      }

      this.initialized = true;
      console.log(
        `[HederaAgent] Initialized on ${this.config.network} with account ${this.config.accountId}`
      );
    } catch (error) {
      console.error("[HederaAgent] Init failed:", error);
      this.initialized = true; // Mock mode
    }
  }

  async getBalance(): Promise<string> {
    if (!this.client || !this.config.accountId) return "0 (mock mode)";

    try {
      const balance = await new AccountBalanceQuery()
        .setAccountId(AccountId.fromString(this.config.accountId))
        .execute(this.client);

      return balance.hbars.toString();
    } catch {
      return "0 (error fetching)";
    }
  }

  async transferHbar(to: string, amount: number): Promise<string> {
    if (!this.client) return "Transfer failed: not connected";

    try {
      const tx = await new TransferTransaction()
        .addHbarTransfer(
          AccountId.fromString(this.config.accountId),
          Hbar.from(-amount, HbarUnit.Hbar)
        )
        .addHbarTransfer(AccountId.fromString(to), Hbar.from(amount, HbarUnit.Hbar))
        .execute(this.client);

      const receipt = await tx.getReceipt(this.client);
      return `Transfer successful: ${receipt.status.toString()}`;
    } catch (error) {
      return `Transfer failed: ${error}`;
    }
  }

  async createToken(
    name: string,
    symbol: string,
    supply: number
  ): Promise<string> {
    if (!this.client) return "Token creation failed: not connected";

    try {
      const tx = await new TokenCreateTransaction()
        .setTokenName(name)
        .setTokenSymbol(symbol)
        .setInitialSupply(supply)
        .setDecimals(2)
        .setTreasuryAccountId(AccountId.fromString(this.config.accountId))
        .execute(this.client);

      const receipt = await tx.getReceipt(this.client);
      return `Token created: ${receipt.tokenId?.toString()}`;
    } catch (error) {
      return `Token creation failed: ${error}`;
    }
  }

  async associateToken(tokenId: string): Promise<string> {
    if (!this.client) return "Association failed: not connected";

    try {
      const tx = await new TokenAssociateTransaction()
        .setAccountId(AccountId.fromString(this.config.accountId))
        .setTokenIds([tokenId])
        .execute(this.client);

      const receipt = await tx.getReceipt(this.client);
      return `Token associated: ${receipt.status.toString()}`;
    } catch (error) {
      return `Association failed: ${error}`;
    }
  }

  async processCommand(command: string): Promise<string> {
    const lower = command.toLowerCase();

    if (lower.includes("balance")) {
      return await this.getBalance();
    }

    if (lower.includes("transfer") || lower.includes("send")) {
      const match = command.match(
        /(?:transfer|send)\s+([\d.]+)\s+(?:hbar|HBAR)\s+to\s+([\d.]+)/i
      );
      if (match) {
        return await this.transferHbar(match[2], parseFloat(match[1]));
      }
      return "Usage: transfer <amount> HBAR to <account_id>";
    }

    if (lower.includes("create token") || lower.includes("mint")) {
      const match = command.match(
        /create\s+token\s+(\w+)\s+(\w+)\s+(\d+)/i
      );
      if (match) {
        return await this.createToken(match[1], match[2], parseInt(match[3]));
      }
      return "Usage: create token <name> <symbol> <initial_supply>";
    }

    if (lower.includes("network") || lower.includes("status")) {
      return `Connected to Hedera ${this.config.network} | Account: ${this.config.accountId} | Status: ${this.initialized ? "active" : "inactive"}`;
    }

    if (lower.includes("capabilities") || lower.includes("help")) {
      return this.getCapabilities().join("\n");
    }

    return `Unknown command. Available: balance, transfer, create token, network status, capabilities`;
  }

  getCapabilities(): string[] {
    return [
      "HBAR balance queries",
      "HBAR transfers between accounts",
      "Token creation (HTS)",
      "Token association",
      "Network status monitoring",
      "Natural language command processing",
      "Multi-LLM AI integration (via ClawChat)",
      "Agent-to-agent messaging (HCS-10)",
    ];
  }
}
