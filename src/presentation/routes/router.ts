import { Express } from "express";
import UserRouter from "./user";
import PipelineRouter from "./pipeline";
import WebhookRouter from "./webhook";
import { ConfirmChannel } from "amqplib";
export default class Router {
  constructor(private readonly app: Express,private readonly ch:ConfirmChannel) {
    this.registerEndpoints();
  }
  private registerEndpoints() {
    new UserRouter(this.app);
    new PipelineRouter(this.app)
    new WebhookRouter(this.app,this.ch)
  }
}
