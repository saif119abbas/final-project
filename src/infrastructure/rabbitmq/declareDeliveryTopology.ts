import { Channel } from "amqplib";
import { Exchanges, Queues, RoutingKeys } from "@core/enum";

const RETRY_TIERS = [
  {
    queue: Queues.RETRY_10S,
    routingKey: RoutingKeys.DELIVERY_RETRY_10S,
    ttl: 5_000,
  },
  {
    queue: Queues.RETRY_30S,
    routingKey: RoutingKeys.DELIVERY_RETRY_30S,
    ttl: 10_000,
  },
  {
    queue: Queues.RETRY_2M,
    routingKey: RoutingKeys.DELIVERY_RETRY_2M,
    ttl: 15_000,
  },
] as const;

export async function declareDeliveryTopology(ch: Channel): Promise<void> {
  await ch.assertExchange(Exchanges.DELIVERY, "direct", { durable: true });
  await ch.assertExchange(Exchanges.DELIVERY_RETRY, "topic", { durable: true });
  await ch.assertQueue(Queues.DELIVERY_ATTEMPTS, {
    durable: true,
    arguments: {
      "x-dead-letter-exchange": Exchanges.DELIVERY_RETRY,
    },
  });
  await ch.bindQueue(
    Queues.DELIVERY_ATTEMPTS,
    Exchanges.DELIVERY,
    RoutingKeys.DELIVERY_ATTEMPT,
  );
  for (const { queue, routingKey, ttl } of RETRY_TIERS) {
    await ch.assertQueue(queue, {
      durable: true,
      arguments: {
        "x-message-ttl": ttl,
        "x-dead-letter-exchange": Exchanges.DELIVERY,
        "x-dead-letter-routing-key": RoutingKeys.DELIVERY_ATTEMPT,
      },
    });
    await ch.bindQueue(queue, Exchanges.DELIVERY_RETRY, routingKey);
  }
  console.log("Delivery topology declared");
}

export { RETRY_TIERS };
