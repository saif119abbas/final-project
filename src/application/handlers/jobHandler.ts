import AckType from "@core/enum/ackType.enum";
import { runAction } from "@application/shared/processors/pipelineAction";
import JobMessage from "@core/dto/rabbitmq/jobMessaage";
import JobStatus from "@core/enum/jobStatus.enum";
import { IJobRepository } from "@core/repositories/jobs";
import amqp from "amqplib";
import DeliveryService from "./deliverToSubscribers";
import { Payload } from "@core/dto/jobs/jobRequest.dto";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export default async function jobHandler(
  message: JobMessage,
  jobRepository: IJobRepository,
  deliveryService: DeliveryService,
  channel: amqp.ConfirmChannel,
): Promise<AckType> {
  const job = await jobRepository.findById(message.jobId);
  if (!job) return AckType.NACK_DISCARD;

  if (job.scheduledFor === null || job.scheduledFor > new Date()) {
    return AckType.NACK_REQUEUE;
  }
  const start = Date.now();
  let result: Payload;
  try {
    result = await runAction(message.actionType, message.payload);
    const elapsed = Date.now() - start;
    if (elapsed < 10_000) await sleep(10_000 - elapsed);
    await jobRepository.update(job.id, {
      status: JobStatus.PROCESSING,
      result: result.data,
    });
    job.result = result.data;
  } catch (error) {
    await jobRepository.update(job.id, {
      status: JobStatus.FAILED,
      error: String(error),
    });
    return AckType.NACK_DISCARD;
  }
  await deliveryService.createJobAttempt(job, channel);
  return AckType.ACK;
}
