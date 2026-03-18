import { Express, Router } from "express";
import PipelineRepository from "@infrastructure/repositories/pipeline.repository";
import WebhookController from "@presentation/controllers/webhook.controller";
import JobRepository from "@infrastructure/repositories/jobs.repository";
import IngestUseCase from "@application/jobs/usecases/ingest.usecase";
import RabbitJobPublisher from "@infrastructure/rabbitmq/jobPublisher";
import { Exchanges, RoutingKeys } from "@core/enum";
import { ConfirmChannel } from "amqplib";

export default class WebhookRouter {
  private readonly controller: WebhookController;
  private readonly router: Router;

  constructor(
    private readonly app: Express,
    private readonly ch: ConfirmChannel,
  ) {
    const pipelineRepository = new PipelineRepository();
    const jobsRepository = new JobRepository();
    const jobPublisher = new RabbitJobPublisher(
      this.ch,
      Exchanges.JOBS,
      RoutingKeys.JOB_CREATED,
    );
    const ingestUseCase = new IngestUseCase(
      pipelineRepository,
      jobsRepository,
      jobPublisher,
    );
    this.controller = new WebhookController(ingestUseCase);
    this.router = Router();
    this.registerEndpoints();
  }

  private registerEndpoints() {
    this.app.use("/webhooks", this.router);
    this.router.post("/:sourcePath", this.controller.ingest);
  }
}
