import registerMappers from "@application/shared/mapper/registerMapper";
import errorHandler from "@presentation/middlewares/errorHandler";
import Router from "@presentation/routes/router";
import cookieParser from "cookie-parser";
import { ConfirmChannel } from "amqplib";
import express from "express";
import { JobPublisher } from "@core/interfaces/queues/jobPublisher";

type AppOptions = {
  channel?: ConfirmChannel;
  jobPublisher?: JobPublisher;
};

export function createApp(options: AppOptions = {}) {
  const app = express();
  app.use(cookieParser());
  app.use(express.json({ limit: "2mb" }));
  app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  new Router(app, options.channel, options.jobPublisher);
  registerMappers();
  app.use(errorHandler);
  return app;
}

export default createApp;
