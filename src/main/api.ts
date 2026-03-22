import { declareAndBind } from "@infrastructure/rabbitmq/queueBinding";
import amqp, { ConfirmChannel } from "amqplib";
import { Exchanges, Queues, RoutingKeys } from "@core/enum";
import rabbitMqConfig from "@config/rabittmq.config";
import SimpleQueueType from "@core/enum/simpleQueueType.enum";
import "dotenv/config";
import createApp from "./app";

async function bootstrap() {
  const connection = await amqp.connect(rabbitMqConfig.url);
  const ch: ConfirmChannel = await connection.createConfirmChannel();
  await declareAndBind(
    connection,
    Exchanges.JOBS,
    Queues.PROCESSING,
    RoutingKeys.JOB_CREATED,
    SimpleQueueType.Durable,
  );
  console.log("RabbitMQ exchange and queue ready");

  const app = createApp({ channel: ch });
  const port = Number(process.env.PORT ?? "3000");

  app.listen(port, () => {
    console.log(`API listening on :${port}`);
  });

  const shutdown = async () => {
    await connection.close();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

bootstrap().catch((err) => {
  console.error(`Fatal startup error: ${err.message ?? err}`);
  process.exit(1);
});
