"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pipeline_repository_1 = __importDefault(require("../../infrastructure/repositories/pipeline.repository"));
const jobs_repository_1 = __importDefault(require("../../infrastructure/repositories/jobs.repository"));
const webhook_controller_1 = __importDefault(require("../controllers/webhook.controller"));
class WebhookRouter {
    constructor(app) {
        this.app = app;
        const pipelineRepository = new pipeline_repository_1.default();
        const jobsRepository = new jobs_repository_1.default();
        this.controller = new webhook_controller_1.default(pipelineRepository, jobsRepository);
        this.router = (0, express_1.Router)();
        this.registerEndpoints();
    }
    registerEndpoints() {
        this.app.use("/webhooks", this.router);
        this.router.post("/:sourcePath", this.controller.ingest);
    }
}
exports.default = WebhookRouter;
