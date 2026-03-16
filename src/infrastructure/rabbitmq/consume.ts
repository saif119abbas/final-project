import { declareAndBind } from "./queueBinding.js";
import type { Channel, ChannelModel, ConsumeMessage } from "amqplib";
import { decode } from "@msgpack/msgpack";
import AckType from "@core/enum/ackType.enum.js";
import SimpleQueueType from "@core/enum/simpleQueueType.enum.js";

export async function subscribe<T>(
  conn: ChannelModel,
  exchange: string,
  queueName: string,
  routingKey: string,
  simpleQueueType: SimpleQueueType,
  handler: (data: T) => Promise<AckType> | AckType,
  deserializer: (data: Buffer) => T,
): Promise<any> {
  const [channel, queue] = await declareAndBind(conn, exchange, queueName, routingKey, simpleQueueType);
   await channel.prefetch(10);
  channel.consume(queue.queue, (message) => handleMessage(message, channel, handler, deserializer));
}

async function handleMessage<T>(
  message: ConsumeMessage | null,
  channel: Channel,
  handler: (data: T) => Promise<AckType> | AckType,
  deserializer: (data: Buffer) => T,
): Promise<any>{
  if (message === null) return;

  const data = deserializer(message.content);
  const ack: AckType = await handler(data);

  switch (ack) {
    case AckType.ACK:
      channel.ack(message);
      break;
    case AckType.NACK_REQUEUE:
      channel.nack(message, false, true);
      break;
    case AckType .NACK_DISCARD:
      channel.nack(message, false, false);
      break;
  }

  process.stdout.write("> ");
}

export async function subscribeJSON<T>(
  conn: ChannelModel,
  exchange: string,
  queueName: string,
  key: string,
  queueType: SimpleQueueType,
  handler: (data: T) => Promise<AckType> | AckType,
): Promise<any> {
  await subscribe(conn, exchange, queueName, key, queueType, handler, 
    (data) => JSON.parse(data.toString()) as T
  );
}

export async function subscribeMsgPack<T>(
  conn: ChannelModel,
  exchange: string,
  queueName: string,
  routingKey: string,
  simpleQueueType: SimpleQueueType,
  handler: (data: T) => Promise<AckType> | AckType,
):Promise<any> {
  await subscribe(conn, exchange, queueName,routingKey, simpleQueueType, handler,
    (data) => decode(data) as T
  );
}