import Exchanges from "@core/enum/exchanges.enum";
import SimpleQueueType from "@core/enum/simpleQueueType.enum";
import type { Channel, ChannelModel, Replies, Options } from "amqplib";

export async function declareAndBind(
  conn: ChannelModel,
  exchange: string,
  queueName: string,
  key: string,
  queueType: SimpleQueueType,
): Promise<[Channel, Replies.AssertQueue]> {
  const channel = await conn.createConfirmChannel();
  await channel.assertExchange(Exchanges.JOBS, "topic", { durable: true });
  const options: Options.AssertQueue = {
    durable: queueType === SimpleQueueType.Durable,
    autoDelete: queueType === SimpleQueueType.Transient,
    exclusive: queueType === SimpleQueueType.Transient,
    arguments: {
      "x-dead-letter-exchange": Exchanges.DEAD_LETTER,
    },
  };
  const queue = await channel.assertQueue(queueName, options);
  await channel.bindQueue(queue.queue, exchange, key);
  return [channel, queue];
}
