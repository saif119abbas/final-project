"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const pipelineRequest_dto_1 = __importDefault(require("../../../core/dto/pipeline/pipelineRequest.dto"));
const pipelineRespone_dto_1 = __importDefault(require("../../../core/dto/pipeline/pipelineRespone.dto"));
const databaseError_1 = __importDefault(require("../../shared/db/databaseError"));
const conflictError_1 = __importDefault(require("../../../core/errors/conflictError"));
const models_1 = require("../../../core/models");
const mapper_1 = __importDefault(require("../../shared/mapper/mapper"));
class CreatePipelineUseCase {
    constructor(pipelineRepository, subscriberRepository, options = {}) {
        this.pipelineRepository = pipelineRepository;
        this.subscriberRepository = subscriberRepository;
        this.options = options;
    }
    async call(ownerId, data) {
        const sourcePath = this.generateSourcePath(this.options.sourcePathPrefix);
        try {
            const pipeline = mapper_1.default.map(data, pipelineRequest_dto_1.default, models_1.Pipeline);
            pipeline.ownerId = ownerId;
            pipeline.sourcePath = sourcePath;
            const createdPipeline = await this.pipelineRepository.create(pipeline);
            const subscriberUrls = data.subscribers ?? [];
            for (const url of subscriberUrls) {
                try {
                    const subscriber = new models_1.Subscriber();
                    subscriber.pipelineId = createdPipeline.id;
                    subscriber.url = url;
                    await this.subscriberRepository.create(subscriber);
                }
                catch (error) {
                    if ((0, databaseError_1.default)(error) && error.cause.code === "23505") {
                        throw new conflictError_1.default("subscriber", "url", url);
                    }
                    throw error;
                }
            }
            const response = mapper_1.default.map(createdPipeline, models_1.Pipeline, pipelineRespone_dto_1.default);
            response.ingestUrl = this.buildIngestUrl(createdPipeline.sourcePath);
            response.subscribers = subscriberUrls;
            return response;
        }
        catch (error) {
            if ((0, databaseError_1.default)(error) && error.cause.code === "23505") {
                throw new conflictError_1.default("pipeline", "sourcePath", sourcePath);
            }
            throw error;
        }
    }
    generateSourcePath(prefix = "pipe") {
        return `${prefix}_${(0, crypto_1.randomUUID)().replace(/-/g, "")}`;
    }
    buildIngestUrl(sourcePath) {
        const base = this.options.webhookBaseUrl?.replace(/\/+$/, "");
        if (!base)
            return `/webhooks/${sourcePath}`;
        return `${base}/webhooks/${sourcePath}`;
    }
}
exports.default = CreatePipelineUseCase;
