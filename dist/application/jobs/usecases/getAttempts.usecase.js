"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notFoundError_1 = __importDefault(require("../../../core/errors/notFoundError"));
class GetAttemptsUsecase {
    constructor(jobRepository) {
        this.jobRepository = jobRepository;
    }
    async call(jobId) {
        const result = await this.jobRepository.getAttemptDetails(jobId);
        if (result === null) {
            throw new notFoundError_1.default(`Job with id:${jobId} not found`);
        }
        return result;
    }
}
exports.default = GetAttemptsUsecase;
