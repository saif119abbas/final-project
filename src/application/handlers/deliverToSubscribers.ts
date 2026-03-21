import AttemptStatus from "@core/enum/attemptStatus.enum";
import { Job, JobAttempt } from "@core/models";
import IJobAttemptRepository from "@core/repositories/jobAttempt";
import { ISubscribersRepository } from "@core/repositories/subscribers";
import DeliveryMessage from "@core/dto/rabbitmq/deliveryMessage";
import amqp from "amqplib";
import { Exchanges, RoutingKeys } from "@core/enum";
import { IJobRepository } from "@core/repositories/jobs";
import JobStatus from "@core/enum/jobStatus.enum";
export default class DeliveryService {
  constructor(
    private readonly subscriberRepository: ISubscribersRepository,
    private readonly jobAttemptRepository: IJobAttemptRepository,
    private readonly jobRepository: IJobRepository,
  ) {}

  async createJobAttempt(
    job: Job,
    channel: amqp.ConfirmChannel,
  ): Promise<void> {
    console.log("Creating attempt...", job);
    if (!job.pipelineId) throw new Error("Job pipelineId is missing");
    if (!job.result) throw new Error("Job has no result to deliver");

    try {
      const subscribers = await this.subscriberRepository.findByPipelineId(
        job.pipelineId!,
      );

      for (const subscriber of subscribers) {
        // Create attempt record in DB
        const jobAttempt = new JobAttempt();
        jobAttempt.jobId = job.id;
        jobAttempt.subscriberId = subscriber.id;
        jobAttempt.attemptNumber = 1;
        jobAttempt.status = AttemptStatus.PENDING;
        jobAttempt.responseCode = null;
        jobAttempt.responseBody = null;
        jobAttempt.nextRetryAt = null;

        const attempt = await this.jobAttemptRepository.create(jobAttempt);

        const deliveryMsg: DeliveryMessage = {
          jobId: job.id,
          attemptId: attempt.id,
          subscriberId: subscriber.id,
          subscriberUrl: subscriber.url,
          result: job.result,
          attemptNumber: 1,
        };

        channel.publish(
          Exchanges.DELIVERY,
          RoutingKeys.DELIVERY_ATTEMPT,
          Buffer.from(JSON.stringify(deliveryMsg)),
          { persistent: true },
        );
      }
    } catch (error) {
      console.error("Delivery setup failed for job", job.id, error);
    }
  }
  async updateJobDeliveryStatus(attempts: JobAttempt[], jobId: string) {
    const total = attempts.length;
    const success = attempts.filter(
      (a) => a.status === AttemptStatus.SUCCESS,
    ).length;
    const failed = attempts.filter(
      (a) => a.status === AttemptStatus.FAILED,
    ).length;
    console.log("total", total);
    console.log("success", success);
    console.log("failed", failed);
    /* const active = attempts.filter(a => 
      a.status === AttemptStatus.PENDING || 
      a.status === AttemptStatus.RETRY
    ).length;*/

    let status;
    if (success === total) {
      status = JobStatus.SUCCESS;
    } else if (failed === total) {
      status = JobStatus.FAILED;
    } else if (success > 0 && failed > 0) {
      status = JobStatus.PARTIAL;
    } else {
      status = JobStatus.PROCESSING;
    }
    await this.jobRepository.update(jobId, { status });
  }
}
