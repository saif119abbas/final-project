import AckType from "@core/enum/ackType.enum";
import { runAction } from "@application/shared/processors/pipelineAction";
import JobMessage from "@core/dto/rabbitmq/jobMessaage";
import JobStatus from "@core/enum/jobStatus.enum";
import { IJobRepository } from "@core/repositories/jobs";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function jobHandler(
  message: JobMessage,
  jobRepository: IJobRepository,
): Promise<AckType> {
  const job = await jobRepository.findById(message.jobId);
  if (!job) {
    return AckType.NACK_DISCARD;
  }

  if (job.scheduledFor === null || job.scheduledFor > new Date()) {
    return AckType.NACK_REQUEUE;
  }

  job.status = JobStatus.PROCESSING;
  jobRepository.update(job.id, job);
  const start = Date.now();

  try {
    const result = await runAction(message.actionType, message.payload);
    console.log("Job result:", result);
    const elapsed = Date.now() - start;
    if (elapsed < 10000) {
      await sleep(10000 - elapsed);
    }
    job.status = JobStatus.SUCCESS;
    job.result = result;
    jobRepository.update(job.id, job);
    return AckType.ACK;
  } catch (error) {
    console.error("Job failed:", error);
    job.status = JobStatus.FAILED;
    job.error = String(error);
    jobRepository.update(job.id, job);
    return AckType.NACK_DISCARD;
  }
}
