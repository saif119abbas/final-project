import "dotenv/config";
import amqp from "amqplib";
import { declareAndBind } from "@infrastructure/rabbitmq/queueBinding";
import { declareDeliveryTopology } from "@infrastructure/rabbitmq/declareDeliveryTopology";
import { startDeliveryConsumer } from "@infrastructure/rabbitmq/deliveryConsumer";
import { Exchanges, Queues, RoutingKeys } from "@core/enum";
import jobHandler from "@application/handlers/jobHandler";
import JobMessage from "@core/dto/rabbitmq/jobMessaage";
import AckType from "@core/enum/ackType.enum";
import rabbitMqConfig from "@config/rabittmq.config";
import SimpleQueueType from "@core/enum/simpleQueueType.enum";
import JobRepository from "@infrastructure/repositories/jobs.repository";
import JobAttemptRepository from "@infrastructure/repositories/jobAttempt.repository";
import SubscriberRepository from "@infrastructure/repositories/subscripers.repository";
import DeliveryService from "@application/handlers/deliverToSubscribers";

async function main() {
  const connection = await amqp.connect(rabbitMqConfig.url);

  const [ch, queue] = await declareAndBind(
    connection,
    Exchanges.JOBS,
    Queues.PROCESSING,
    RoutingKeys.JOB_CREATED,
    SimpleQueueType.Durable,
  );

  const topologyChannel = await connection.createChannel();
  await declareDeliveryTopology(topologyChannel);
  await topologyChannel.close(); // done, don't keep it open
  const deliveryPublishChannel = await connection.createConfirmChannel();
  const jobRepository = new JobRepository();
  const jobAttemptRepository = new JobAttemptRepository();
  const subscriberRepository = new SubscriberRepository();
  const deliveryService = new DeliveryService(
    subscriberRepository,
    jobAttemptRepository,
    jobRepository,
  );
  await ch.prefetch(10);

  await ch.consume(
    queue.queue,
    async (msg) => {
      if (!msg) return;
      try {
        const jobMessage = JSON.parse(msg.content.toString()) as JobMessage;
        const ack = await jobHandler(
          jobMessage,
          jobRepository,
          deliveryService,
          deliveryPublishChannel,
        );

        if (ack === AckType.ACK) ch.ack(msg);
        else if (ack === AckType.NACK_REQUEUE) ch.nack(msg, false, true);
        else ch.nack(msg, false, false);
      } catch (err) {
        console.error("Job processing failed:", err);
        ch.nack(msg, false, false);
      }
    },
    { noAck: false },
  );
  await startDeliveryConsumer(
    connection,
    jobAttemptRepository,
    deliveryService,
  );
  console.log("Worker started, waiting for jobs...");
  const shutdown = async () => {
    await ch.close();
    await deliveryPublishChannel.close();
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
