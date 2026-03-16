import * as amqp from "amqplib";
import type { Channel, Options } from "amqplib";

type AmqpConnection = Awaited<ReturnType<typeof amqp.connect>>;

let connection: AmqpConnection | null = null;
let channel: Channel | null = null;

export async function getRabbitChannel(): Promise<Channel> {
  if (channel) return channel;

  const rabbitUrl = process.env.RABBITMQ_URL;
  if (!rabbitUrl) {
    throw new Error("RABBITMQ_URL is not set");
  }

  connection = await amqp.connect(rabbitUrl);
  channel = await connection.createChannel();

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
