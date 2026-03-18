"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pipelineRespone_dto_1 = __importDefault(require("@core/dto/pipeline/pipelineRespone.dto"));
const models_1 = require("@core/models");
const mapper_1 = __importDefault(require("@application/shared/mapper/mapper"));
const notFoundError_1 = __importDefault(require("@core/errors/notFoundError"));
const forbiddenError_1 = __importDefault(require("@core/errors/forbiddenError"));
const databaseError_1 = __importDefault(require("@application/shared/db/databaseError"));
const conflictError_1 = __importDefault(require("@core/errors/conflictError"));
class UpdatePipelineUseCase {
    constructor(pipelineRepository, subscriberRepository, options = {}) {
        this.pipelineRepository = pipelineRepository;
        this.subscriberRepository = subscriberRepository;
        this.options = options;
    }
    async call(ownerId, pipelineId, data) {
        const existing = await this.pipelineRepository.findById(pipelineId);
        if (!existing) {
            throw new notFoundError_1.default("pipeline", "id", pipelineId);
        }
        if (existing.ownerId !== ownerId) {
            throw new forbiddenError_1.default();
        }
        const updated = await this.pipelineRepository.update(pipelineId, {
            name: data.name,
            description: data.description ?? null,
            actionType: data.actionType,
            actionConfig: data.actionConfig ?? {},
        });
        const existingSubscribers = await this.subscriberRepository.findByPipelineId(pipelineId);
        const incomingSubscribers = data.subscribers;
        let finalSubscribers = existingSubscribers.map((s) => s.url);
        if (incomingSubscribers !== undefined) {
            const deduped = Array.from(new Set(incomingSubscribers));
            const existingByUrl = new Map(existingSubscribers.map((s) => [s.url, s]));
            const desiredSet = new Set(deduped);
            const toAdd = deduped.filter((url) => !existingByUrl.has(url));
            const toRemove = existingSubscribers.filter((s) => !desiredSet.has(s.url));
            for (const url of toAdd) {
                try {
                    const subscriber = new models_1.Subscriber();
                    subscriber.pipelineId = pipelineId;
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
            for (const subscriber of toRemove) {
                await this.subscriberRepository.delete(subscriber.id);
            }
            finalSubscribers = deduped;
        }
        const response = mapper_1.default.map(updated, models_1.Pipeline, pipelineRespone_dto_1.default);
        response.ingestUrl = this.buildIngestUrl(updated.sourcePath);
        response.subscribers = finalSubscribers;
        return response;
    }
    buildIngestUrl(sourcePath) {
        const base = this.options.webhookBaseUrl?.replace(/\/+$/, "");
        if (!base)
            return `/webhooks/${sourcePath}`;
        return `${base}/webhooks/${sourcePath}`;
    }
}
exports.default = UpdatePipelineUseCase;
