"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notFoundError_1 = __importDefault(require("@core/errors/notFoundError"));
const connection_1 = require("@infrastructure/rabbitmq/connection");
class WebhookController {
    constructor(pipelineRepository, jobsRepository) {
        this.pipelineRepository = pipelineRepository;
        this.jobsRepository = jobsRepository;
        this.ingest = async (req, res, next) => {
            try {
                const sourcePathParam = req.params.sourcePath;
                const sourcePath = Array.isArray(sourcePathParam)
                    ? sourcePathParam[0]
                    : sourcePathParam;
                const pipeline = await this.pipelineRepository.findBySourcePath(sourcePath);
                if (!pipeline) {
                    throw new notFoundError_1.default("pipeline", "sourcePath", sourcePath);
                }
                const job = await this.jobsRepository.create({
                    pipelineId: pipeline.id,
                    payload: req.body,
                });
                await (0, connection_1.publishJson)(connection_1.DEFAULT_QUEUE, {
                    jobId: job.id,
                });
                res.status(202).json({
                    ok: true,
                    message: "queued",
                    data: { jobId: job.id },
                });
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.default = WebhookController;
