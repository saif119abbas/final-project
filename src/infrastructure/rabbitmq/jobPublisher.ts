import { ConfirmChannel } from "amqplib";
import { JobPublisher } from "@core/interfaces/queues/jobPublisher";
import { publishJSON } from "./publisher";
import JobMessage from "@core/dto/rabbitmq/jobMessaage";

export default class RabbitJobPublisher implements JobPublisher {

  constructor(
    private readonly channel: ConfirmChannel,
    private readonly exchange: string,
    private readonly routingKey: string
  ) {}

  async publishJob(payload: JobMessage): Promise<void> {
    await publishJSON(
      this.channel,
      this.exchange,
      this.routingKey,
      payload
    );
  }
}
