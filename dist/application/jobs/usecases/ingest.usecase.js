"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const databaseError_1 = __importDefault(require("../../shared/db/databaseError"));
const conflictError_1 = __importDefault(require("../../../core/errors/conflictError"));
const notFoundError_1 = __importDefault(require("../../../core/errors/notFoundError"));
const models_1 = require("../../../core/models");
const jobStatus_enum_1 = __importDefault(require("../../../core/enum/jobStatus.enum"));
const enum_1 = require("../../../core/enum");
class IngestUseCase {
    constructor(pipelineRepository, jobRepository, jobPublisher) {
        this.pipelineRepository = pipelineRepository;
        this.jobRepository = jobRepository;
        this.jobPublisher = jobPublisher;
    }
    async call(sourcePath, payload) {
        const data = Array.isArray(sourcePath) ? sourcePath[0] : sourcePath;
        try {
            const pipeline = await this.pipelineRepository.findBySourcePath(data);
            if (!pipeline) {
                throw new notFoundError_1.default("pipeline", "sourcePath", sourcePath);
            }
            const job = new models_1.Job();
            job.pipelineId = pipeline.id;
            job.payload = payload.payload;
            job.status = jobStatus_enum_1.default.PENDING;
            job.scheduledFor = new Date(Date.now() + 60 * 1000);
            const jobCreated = await this.jobRepository.create(job);
            const message = {
                jobId: jobCreated.id,
                actionType: pipeline.actionType,
                payload: payload.payload,
            };
            console.log("Publishing message:", JSON.stringify(message));
            console.log("Exchange:", enum_1.Exchanges.JOBS, "RoutingKey:", enum_1.RoutingKeys.JOB_CREATED);
            await this.jobPublisher.publishJob(message);
            console.log("Message published successfully");
            return { jobId: jobCreated.id };
        }
        catch (error) {
            if ((0, databaseError_1.default)(error) && error.cause.code === "23505") {
                throw new conflictError_1.default("pipeline", "sourcePath", data);
            }
            throw error;
        }
    }
}
exports.default = IngestUseCase;
