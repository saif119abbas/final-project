import { Exchanges, Queues, RoutingKeys } from "@core/enum";
import { JobPublisher } from "@core/interfaces/queues/jobPublisher";
import rabbitMqConfig from "@config/rabittmq.config";
import { declareAndBind } from "@infrastructure/rabbitmq/queueBinding";
import amqp, { ConfirmChannel } from "amqplib";
import "dotenv/config";
import { Server } from "http";
import type { AddressInfo } from "net";
import createApp from "./app";
import SimpleQueueType from "@core/enum/simpleQueueType.enum";

export type StartApiOptions = {
  port?: number;
  channel?: ConfirmChannel;
  jobPublisher?: JobPublisher;
  connectRabbit?: boolean;
};

export type StartedApi = {
  server: Server;
  port: number;
  baseUrl: string;
  stop: () => Promise<void>;
};

export async function startApiServer(
  options: StartApiOptions = {},
): Promise<StartedApi> {
  const connectRabbit = options.connectRabbit ?? true;
  let connection: amqp.ChannelModel;
  let channel = options.channel;

  if (connectRabbit) {
    connection = await amqp.connect(rabbitMqConfig.url);
    channel = await connection.createConfirmChannel();
    await declareAndBind(
      connection,
      Exchanges.JOBS,
      Queues.PROCESSING,
      RoutingKeys.JOB_CREATED,
      SimpleQueueType.Durable,
    );
    console.log("RabbitMQ exchange and queue ready");
  }

  const app = createApp({
    channel,
    jobPublisher: options.jobPublisher,
  });

  const listenPort = options.port ?? Number(process.env.PORT ?? "3000");
  const server: Server = await new Promise((resolve) => {
    const srv = app.listen(listenPort, () => resolve(srv));
  });

  const address = server.address() as AddressInfo;
  const port = address.port;
  const baseUrl = `http://127.0.0.1:${port}`;

  const stop = async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
    if (connection) {
      await connection.close();
    }
  };

  return { server, port, baseUrl, stop };
}

async function runApiServer() {
  const started = await startApiServer();
  console.log(`API listening on :${started.port}`);

  const shutdown = async () => {
    await started.stop();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

if (require.main === module) {
  runApiServer().catch((err) => {
    console.error(`Fatal startup error: ${err.message ?? err}`);
    process.exit(1);
  });
}

export default startApiServer;
