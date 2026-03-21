import registerMappers from "@application/shared/mapper/registerMapper";
import { declareAndBind } from "@infrastructure/rabbitmq/queueBinding";
import errorHandler from "@presentation/middlewares/errorHandler";
import Router from "@presentation/routes/router";
import cookieParser from "cookie-parser";
import amqp, { ConfirmChannel } from "amqplib";
import { Exchanges, Queues, RoutingKeys } from "@core/enum";
import rabbitMqConfig from "@config/rabittmq.config";
import SimpleQueueType from "@core/enum/simpleQueueType.enum";
import "dotenv/config";
import express from "express";

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

  const app = express();
  app.use(cookieParser());
  app.use(express.json({ limit: "2mb" }));
  app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  const port = Number(process.env.PORT ?? "3000");
  new Router(app, ch);
  registerMappers();
  app.use(errorHandler);

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
