import { Express } from "express";
import UserRouter from "./user";
import PipelineRouter from "./pipeline";
import { ConfirmChannel } from "amqplib";
import JobRouter from "./job";
import { JobPublisher } from "@core/interfaces/queues/jobPublisher";
export default class Router {
  constructor(
    private readonly app: Express,
    private readonly ch?: ConfirmChannel,
    private readonly jobPublisher?: JobPublisher,
  ) {
    this.registerEndpoints();
  }
  private registerEndpoints() {
    new UserRouter(this.app);
    new PipelineRouter(this.app);
    new JobRouter(this.app, {
      ch: this.ch,
      jobPublisher: this.jobPublisher,
    });
  }
}
