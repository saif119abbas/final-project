import { Express } from "express";
import UserRouter from "./user";
import PipelineRouter from "./pipeline";
import { ConfirmChannel } from "amqplib";
import JobRouter from "./job";
export default class Router {
  constructor(
    private readonly app: Express,
    private readonly ch: ConfirmChannel,
  ) {
    this.registerEndpoints();
  }
  private registerEndpoints() {
    new UserRouter(this.app);
    new PipelineRouter(this.app);
    new JobRouter(this.app, this.ch);
  }
}
