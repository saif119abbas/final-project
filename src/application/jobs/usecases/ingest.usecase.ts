import IUseCase from "@core/shared/useCase";
import IPipelineRepository from "@core/repositories/pipeline";
import isDatabaseError from "@application/shared/db/databaseError";
import ConflictError from "@core/errors/conflictError";
import { IJobRepository } from "@core/repositories/jobs";
import NotFoundError from "@core/errors/notFoundError";
import { Job } from "@core/models";
import JobRequest from "@core/dto/jobs/jobRequest.dto";
import JobStatus from "@core/enum/jobStatus.enum";
import { JobPublisher } from "@core/interfaces/queues/jobPublisher";
import JobMessage from "@core/dto/rabbitmq/jobMessaage";
import { Exchanges, RoutingKeys } from "@core/enum";
export default class IngestUseCase implements IUseCase<{ jobId: string }> {
  constructor(
    private readonly pipelineRepository: IPipelineRepository,
    private readonly jobRepository: IJobRepository,
    private readonly jobPublisher: JobPublisher,
  ) {}

  async call(
    sourcePath: string | string[],
    payload: JobRequest,
  ): Promise<{ jobId: string }> {
    const data = Array.isArray(sourcePath) ? sourcePath[0] : sourcePath;

    try {
      const pipeline = await this.pipelineRepository.findBySourcePath(data);
      if (!pipeline) {
        throw new NotFoundError("pipeline", "sourcePath", sourcePath);
      }

      const job = new Job();
      job.pipelineId = pipeline.id;
      job.payload = payload.payload;
      job.status = JobStatus.PENDING;
      job.scheduledFor = new Date(Date.now() + 2 * 60 * 1000);

      const jobCreated = await this.jobRepository.create(job);
      const message: JobMessage = {
        jobId: jobCreated.id,
        actionType: pipeline.actionType,
        actionConfig: pipeline.actionConfig,
        payload: payload.payload,
      };

      console.log("Publishing message:", JSON.stringify(message));
      console.log(
        "Exchange:",
        Exchanges.JOBS,
        "RoutingKey:",
        RoutingKeys.JOB_CREATED,
      );

      await this.jobPublisher.publishJob(message);

      console.log("Message published successfully");

      return { jobId: jobCreated.id };
    } catch (error: unknown) {
      if (isDatabaseError(error) && error.cause.code === "23505") {
        throw new ConflictError("pipeline", "sourcePath", data);
      }
      throw error;
    }
  }
}
