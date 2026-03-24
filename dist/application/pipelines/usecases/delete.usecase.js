"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notFoundError_1 = __importDefault(require("../../../core/errors/notFoundError"));
class DeletePipelineUseCase {
    constructor(pipelineRepository) {
        this.pipelineRepository = pipelineRepository;
    }
    async call(pipelineId) {
        const pipeline = await this.pipelineRepository.findById(pipelineId);
        if (pipeline === null) {
            throw new notFoundError_1.default("pipeline", "id", pipelineId);
        }
        await this.pipelineRepository.delete(pipelineId);
    }
}
exports.default = DeletePipelineUseCase;
