import * as amqp from "amqplib";
import type { ConfirmChannel } from "amqplib";
import rabbitmq from "@config/rabittmq.config";
type AmqpConnection = Awaited<ReturnType<typeof amqp.connect>>;
let connection: AmqpConnection | null = null;
let channel: ConfirmChannel | null = null;

type RetryConfig = {
  attempts: number;
  delayMs: number;
};

const DEFAULT_RETRY_ATTEMPTS = 20;
const DEFAULT_RETRY_DELAY_MS = 1000;

function getRetryConfig(): RetryConfig {
  const attemptsEnv = Number.parseInt(
    process.env.RABBITMQ_RETRY_ATTEMPTS ?? "",
    10,
  );
  const delayEnv = Number.parseInt(
    process.env.RABBITMQ_RETRY_DELAY_MS ?? "",
    10,
  );
  const attempts = Number.isFinite(attemptsEnv)
    ? attemptsEnv
    : DEFAULT_RETRY_ATTEMPTS;
  const fallbackDelay = Number.isFinite(rabbitmq.rertyPollInternalMs)
    ? rabbitmq.rertyPollInternalMs
    : DEFAULT_RETRY_DELAY_MS;
  const delayMs = Number.isFinite(delayEnv) ? delayEnv : fallbackDelay;
  return {
    attempts: Math.max(1, attempts),
    delayMs: Math.max(100, delayMs),
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function connectWithRetry(): Promise<AmqpConnection> {
  const rabbitUrl = rabbitmq.url;
  if (!rabbitUrl) {
    throw new Error("RABBITMQ_URL is not set");
  }
  const { attempts, delayMs } = getRetryConfig();
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await amqp.connect(rabbitUrl);
    } catch (err) {
      lastError = err;
      if (attempt < attempts) {
        console.warn(
          `RabbitMQ connection failed (attempt ${attempt}/${attempts}). Retrying in ${delayMs}ms...`,
        );
        await sleep(delayMs);
      }
    }
  }
  throw lastError;
}

export async function getRabbitChannel(): Promise<ConfirmChannel> {
  if (channel) return channel;
  connection = await connectWithRetry();
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
