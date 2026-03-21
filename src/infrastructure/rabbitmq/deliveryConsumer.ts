import amqp from "amqplib";
import { Exchanges, Queues, RoutingKeys } from "@core/enum";
import { RETRY_TIERS } from "./declareDeliveryTopology";
import DeliveryMessage from "@core/dto/rabbitmq/deliveryMessage";
import AttemptStatus from "@core/enum/attemptStatus.enum";
import IJobAttemptRepository from "@core/repositories/jobAttempt";
import DeliveryService from "@application/handlers/deliverToSubscribers";
import { JobAttempt } from "@core/models";

const MAX_RETRIES = 5;

function getRetryRoutingKey(attemptNumber: number): string {
  if (attemptNumber <= 2) return RoutingKeys.DELIVERY_RETRY_10S;
  if (attemptNumber === 3) return RoutingKeys.DELIVERY_RETRY_30S;
  return RoutingKeys.DELIVERY_RETRY_2M;
}
async function getAttempts(
  jobAttemptRepository: IJobAttemptRepository,
  jobId: string,
): Promise<JobAttempt[]> {
  return await jobAttemptRepository.findByJobId(jobId);
}
async function allAttemptsSettled(attempts: JobAttempt[]): Promise<boolean> {
  return attempts.every(
    (a) =>
      a.status === AttemptStatus.SUCCESS || a.status === AttemptStatus.FAILED,
  );
}

export async function startDeliveryConsumer(
  connection: amqp.ChannelModel,
  jobAttemptRepository: IJobAttemptRepository,
  deliveryService: DeliveryService,
): Promise<void> {
  const ch = await connection.createChannel();
  await ch.prefetch(10);

  await ch.consume(
    Queues.DELIVERY_ATTEMPTS,
    async (msg) => {
      if (!msg) return;

      const delivery = JSON.parse(msg.content.toString()) as DeliveryMessage;
      console.log(
        `Delivery attempt ${delivery.attemptNumber} for job ${delivery.jobId}`,
      );

      let responseCode: string | null = null;
      let responseBody: string | null = null;
      let errorMessage: string | null = null;
      let succeeded = false;

      try {
        const response = await fetch(delivery.subscriberUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(delivery.result),
        });

        responseCode = String(response.status);
        responseBody = await response.text();
        succeeded = response.ok;

        if (!succeeded) {
          errorMessage = `HTTP ${response.status}: ${responseBody}`;
        }
      } catch (err) {
        errorMessage = String(err);
      }

      // ── Terminal: success ───────────────────────────────────────────
      if (succeeded) {
        await jobAttemptRepository.update(delivery.attemptId, {
          status: AttemptStatus.SUCCESS,
          responseCode,
          responseBody,
          nextRetryAt: null,
        });
        ch.ack(msg);
        console.log(`Delivery succeeded for attempt ${delivery.attemptId}`);

        const attempts = await getAttempts(
          jobAttemptRepository,
          delivery.jobId,
        );
        if (await allAttemptsSettled(attempts)) {
          console.log("succeeded");
          await deliveryService.updateJobDeliveryStatus(
            attempts,
            delivery.jobId,
          );
        }
        return;
      }

      // ── Terminal: exhausted retries ─────────────────────────────────
      const exhausted = delivery.attemptNumber >= MAX_RETRIES;

      if (exhausted) {
        console.log("exhausted");
        await jobAttemptRepository.update(delivery.attemptId, {
          status: AttemptStatus.FAILED,
          responseCode,
          responseBody: errorMessage,
          nextRetryAt: null,
        });
        console.warn(
          `Delivery exhausted after ${MAX_RETRIES} attempts for job ${delivery.jobId}`,
        );
        const attempts = await getAttempts(
          jobAttemptRepository,
          delivery.jobId,
        );
        console.log("attempts", attempts);
        if (await allAttemptsSettled(attempts)) {
          await deliveryService.updateJobDeliveryStatus(
            attempts,
            delivery.jobId,
          );
        }
        ch.ack(msg);
        return;
      }

      // ── Non-terminal: schedule retry ────────────────────────────────
      const nextAttemptNumber = delivery.attemptNumber + 1;
      const retryRoutingKey = getRetryRoutingKey(nextAttemptNumber);
      const tier = RETRY_TIERS.find((t) => t.routingKey === retryRoutingKey)!;
      const nextRetryAt = new Date(Date.now() + tier.ttl);

      await jobAttemptRepository.update(delivery.attemptId, {
        status: AttemptStatus.RETRY,
        attemptNumber: nextAttemptNumber,
        responseCode,
        responseBody: errorMessage,
        nextRetryAt,
      });

      const retryMsg: DeliveryMessage = {
        ...delivery,
        attemptNumber: nextAttemptNumber,
      };

      ch.publish(
        Exchanges.DELIVERY_RETRY,
        retryRoutingKey,
        Buffer.from(JSON.stringify(retryMsg)),
        { persistent: true },
      );

      console.log(
        `Delivery failed (attempt ${delivery.attemptNumber}), ` +
          `retrying as attempt ${nextAttemptNumber} via ${retryRoutingKey} ` +
          `(${tier.ttl / 1000}s delay)`,
      );

      ch.ack(msg);
    },
    { noAck: false },
  );

  console.log("Delivery consumer started");
}
