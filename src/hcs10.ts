import {
  Client,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TopicMessageQuery,
  TopicId,
  AccountId,
  PrivateKey,
} from "@hashgraph/sdk";

export interface HCS10Message {
  from: string;
  to: string;
  type: "request" | "response" | "broadcast";
  payload: string;
  timestamp: number;
}

export class HCS10Messaging {
  private client: Client;
  private topicId: TopicId | null = null;
  private messageHandlers: ((msg: HCS10Message) => void)[] = [];

  constructor(client: Client) {
    this.client = client;
  }

  async createTopic(memo: string = "ClawChat Agent Channel"): Promise<string> {
    try {
      const tx = await new TopicCreateTransaction()
        .setTopicMemo(memo)
        .execute(this.client);

      const receipt = await tx.getReceipt(this.client);
      this.topicId = receipt.topicId!;
      console.log(`[HCS-10] Topic created: ${this.topicId.toString()}`);
      return this.topicId.toString();
    } catch (error) {
      console.error("[HCS-10] Failed to create topic:", error);
      throw error;
    }
  }

  async connectToTopic(topicIdStr: string): Promise<void> {
    this.topicId = TopicId.fromString(topicIdStr);
    console.log(`[HCS-10] Connected to topic: ${topicIdStr}`);
  }

  async sendMessage(message: HCS10Message): Promise<string> {
    if (!this.topicId) throw new Error("No topic connected");

    try {
      const tx = await new TopicMessageSubmitTransaction()
        .setTopicId(this.topicId)
        .setMessage(JSON.stringify(message))
        .execute(this.client);

      const receipt = await tx.getReceipt(this.client);
      return `Message sent: sequence ${receipt.topicSequenceNumber?.toString()}`;
    } catch (error) {
      return `Send failed: ${error}`;
    }
  }

  subscribe(): void {
    if (!this.topicId) throw new Error("No topic connected");

    new TopicMessageQuery()
      .setTopicId(this.topicId)
      .subscribe(this.client, (error) => {
        console.error("[HCS-10] Subscription error:", error);
      }, (message) => {
        try {
          const parsed: HCS10Message = JSON.parse(
            Buffer.from(message.contents).toString()
          );
          for (const handler of this.messageHandlers) {
            handler(parsed);
          }
        } catch {
          console.error("[HCS-10] Failed to parse message");
        }
      });

    console.log(`[HCS-10] Subscribed to topic ${this.topicId.toString()}`);
  }

  onMessage(handler: (msg: HCS10Message) => void): void {
    this.messageHandlers.push(handler);
  }

  async broadcastCapabilities(agentId: string, capabilities: string[]): Promise<string> {
    const msg: HCS10Message = {
      from: agentId,
      to: "broadcast",
      type: "broadcast",
      payload: JSON.stringify({
        action: "announce",
        capabilities,
        version: "1.0.0",
        protocol: "HCS-10",
      }),
      timestamp: Date.now(),
    };

    return this.sendMessage(msg);
  }

  async requestService(
    fromAgent: string,
    toAgent: string,
    service: string,
    params: Record<string, unknown>
  ): Promise<string> {
    const msg: HCS10Message = {
      from: fromAgent,
      to: toAgent,
      type: "request",
      payload: JSON.stringify({ service, params }),
      timestamp: Date.now(),
    };

    return this.sendMessage(msg);
  }
}
