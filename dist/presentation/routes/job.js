"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pipeline_repository_1 = __importDefault(require("../../infrastructure/repositories/pipeline.repository"));
const jobs_repository_1 = __importDefault(require("../../infrastructure/repositories/jobs.repository"));
const ingest_usecase_1 = __importDefault(require("../../application/jobs/usecases/ingest.usecase"));
const jobPublisher_1 = __importDefault(require("../../infrastructure/rabbitmq/jobPublisher"));
const enum_1 = require("../../core/enum");
const job_controller_1 = __importDefault(require("../controllers/job.controller"));
const getJobById_usecase_1 = __importDefault(require("../../application/jobs/usecases/getJobById.usecase"));
const getAttempts_usecase_1 = __importDefault(require("../../application/jobs/usecases/getAttempts.usecase"));
const getJobs_usecase_1 = __importDefault(require("../../application/jobs/usecases/getJobs.usecase"));
class JobRouter {
    constructor(app, ch) {
        this.app = app;
        this.ch = ch;
        const pipelineRepository = new pipeline_repository_1.default();
        const jobsRepository = new jobs_repository_1.default();
        const jobPublisher = new jobPublisher_1.default(this.ch, enum_1.Exchanges.JOBS, enum_1.RoutingKeys.JOB_CREATED);
        const ingestUseCase = new ingest_usecase_1.default(pipelineRepository, jobsRepository, jobPublisher);
        const getJobDetailUsecase = new getJobById_usecase_1.default(jobsRepository);
        const getAttemptsUsecase = new getAttempts_usecase_1.default(jobsRepository);
        const getJobs = new getJobs_usecase_1.default(jobsRepository);
        this.controller = new job_controller_1.default(ingestUseCase, getJobDetailUsecase, getAttemptsUsecase, getJobs);
        this.router = (0, express_1.Router)();
        this.registerEndpoints();
    }
    registerEndpoints() {
        this.app.post("/webhooks/:sourcePath", this.controller.ingest);
        this.router.get("/:id", this.controller.getJobDetails);
        this.router.get("/:id/attempts", this.controller.getAttempts);
        this.router.get("", this.controller.getJobs);
        this.app.use("/jobs", this.router);
    }
}
exports.default = JobRouter;
