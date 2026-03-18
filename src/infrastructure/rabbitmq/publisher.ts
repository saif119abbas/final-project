import { encode } from "@msgpack/msgpack";
import { type ConfirmChannel } from "amqplib";

function publishJSON<T>(
  ch: ConfirmChannel,
  exchange: string,
  routingKey: string,
  value: T,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const message = Buffer.from(JSON.stringify(value));
    ch.publish(
      exchange,
      routingKey,
      message,
      { contentType: "application/json" },
      (err) => {
        if (err) reject(err);
        else {
          resolve();
        }
      },
    );
  });
}
export function publishMsgPack<T>(
  ch: ConfirmChannel,
  exchange: string,
  routingKey: string,
  value: T,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const options = {
      contentType: "application/x-msgpack",
    };
    const binaryMessage = Buffer.from(encode(value, options));
    ch.publish(
      exchange,
      routingKey,
      binaryMessage,
      { contentType: "application/json" },
      (err) => {
        if (err) reject(err);
        else {
          resolve();
        }
      },
    );
  });
}
export { publishJSON };
