/*import { ChannelModel, ConfirmChannel } from "amqplib";
import { subscribeJSON } from "./consume";
import Exchanges from "@core/enum/exchanges.enum"
import { Queues, RoutingKeys } from "@core/enum";
import SimpleQueueType from "@core/enum/simpleQueueType.enum";
import jobHandler from "@application/handlers/jobHandler";
import JobMessage from "@core/dto/rabbitmq/jobMessaage";
export async function subscribe(conn:ChannelModel,message:JobMessage):Promise<void>
{

  await subscribeJSON(
    conn,
    Exchanges.JOBS,
    Queues.PROCESSING,
    RoutingKeys.JOB_PROCESSED,
    SimpleQueueType.Transient,
    await jobHandler(message)
  )
}*/