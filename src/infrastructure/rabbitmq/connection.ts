import * as amqp from "amqplib";
import type { ConfirmChannel } from "amqplib";
import rabbitmq from "@config/rabittmq.config"
type AmqpConnection = Awaited<ReturnType<typeof amqp.connect>>;
let connection: AmqpConnection | null = null;
let channel: ConfirmChannel | null = null;

export async function getRabbitChannel(): Promise<ConfirmChannel> {
  if (channel) return channel;
  const rabbitUrl = rabbitmq.url;
  if (!rabbitUrl) {
    throw new Error("RABBITMQ_URL is not set");
  }
  connection = await amqp.connect(rabbitUrl);
  channel = await connection.createConfirmChannel();

  const close = async () => {
    try {
      await channel?.close();
    } catch {
      // ignore
    }
    try {
      await connection?.close();
    } catch {
      // ignore
    }
    channel = null;
    connection = null;
  };

  process.on("SIGINT", close);
  process.on("SIGTERM", close);

  return channel!;
}

/*export async function publishJson(
  queue: string,
  message: unknown,
  options: Options.Publish = adsa{ persistent: true },
): Promise<void> {
  const ch = await getRabbitChannel();
  await ch.assertQueue(queue, { durable: true });
  const payload = Buffer.from(JSON.stringify(message));
  ch.sendToQueue(queue, payload, options);
}*/
