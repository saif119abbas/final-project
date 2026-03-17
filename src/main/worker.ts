import "dotenv/config";
import amqp from "amqplib";
import { declareAndBind } from "@infrastructure/rabbitmq/queueBinding";
import { Exchanges, Queues, RoutingKeys } from "@core/enum";
import jobHandler from "@application/handlers/jobHandler";
import JobMessage from "@core/dto/rabbitmq/jobMessaage";
import AckType from "@core/enum/ackType.enum";
import rabbitMqConfig from "@config/rabittmq.config";
import SimpleQueueType from "@core/enum/simpleQueueType.enum";

async function main() {
  const connection = await amqp.connect(rabbitMqConfig.url);

  const [channel, queue] = await declareAndBind(  // ← this was missing
    connection,
    Exchanges.JOBS,
    Queues.PROCESSING,
    RoutingKeys.JOB_CREATED,
    SimpleQueueType.Durable
  );

  await channel.prefetch(10);

  await channel.consume(
    queue.queue,
    async (msg) => {
      if (!msg) return;
      try {
        const jobMessage = JSON.parse(msg.content.toString()) as JobMessage;
        const ack = await jobHandler(jobMessage);

        if (ack === AckType.ACK) channel.ack(msg);
        else if (ack === AckType.NACK_REQUEUE) channel.nack(msg, false, true);
        else channel.nack(msg, false, false);
      } catch (err) {
        console.error("Job processing failed:", err);
        channel.nack(msg, false, false);
      }
    },
    { noAck: false }
  );

  console.log("Worker started, waiting for jobs...");

  const shutdown = async () => {
    await channel.close();
    await connection.close();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error(`Fatal error: ${err.message ?? err}`);
  process.exit(1);
});