import { Express, Router } from "express";
import PipelineRepository from "@infrastructure/repositories/pipeline.repository";
import JobRepository from "@infrastructure/repositories/jobs.repository";
import IngestUseCase from "@application/jobs/usecases/ingest.usecase";
import RabbitJobPublisher from "@infrastructure/rabbitmq/jobPublisher";
import { Exchanges, RoutingKeys } from "@core/enum";
import { ConfirmChannel } from "amqplib";
import JobController from "@presentation/controllers/job.controller";
import GetJobById from "@application/jobs/usecases/getJobById.usecase";
import GetAttemptsUsecase from "@application/jobs/usecases/getAttempts.usecase";
import getJobsUsecase from "@application/jobs/usecases/getJobs.usecase";
import { JobPublisher } from "@core/interfaces/queues/jobPublisher";

type JobRouterOptions = {
  ch?: ConfirmChannel;
  jobPublisher?: JobPublisher;
};

export default class JobRouter {
  private readonly controller: JobController;
  private readonly router: Router;

  constructor(
    private readonly app: Express,
    options: JobRouterOptions = {},
  ) {
    const pipelineRepository = new PipelineRepository();
    const jobsRepository = new JobRepository();
    const jobPublisher =
      options.jobPublisher ??
      (options.ch
        ? new RabbitJobPublisher(
            options.ch,
            Exchanges.JOBS,
            RoutingKeys.JOB_CREATED,
          )
        : null);

    if (!jobPublisher) {
      throw new Error("JobPublisher or ConfirmChannel is required");
    }
    const ingestUseCase = new IngestUseCase(
      pipelineRepository,
      jobsRepository,
      jobPublisher,
    );
    const getJobDetailUsecase = new GetJobById(jobsRepository);
    const getAttemptsUsecase = new GetAttemptsUsecase(jobsRepository);
    const getJobs = new getJobsUsecase(jobsRepository);
    this.controller = new JobController(
      ingestUseCase,
      getJobDetailUsecase,
      getAttemptsUsecase,
      getJobs,
    );
    this.router = Router();
    this.registerEndpoints();
  }

  private registerEndpoints() {
    this.app.post("/webhooks/:sourcePath", this.controller.ingest);
    this.router.get("/:id", this.controller.getJobDetails);
    this.router.get("/:id/attempts", this.controller.getAttempts);
    this.router.get("", this.controller.getJobs);
    this.app.use("/jobs", this.router);
  }
}
