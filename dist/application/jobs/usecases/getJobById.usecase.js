"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mapper_1 = __importDefault(require("../../shared/mapper/mapper"));
const jobDetails_dto_1 = __importDefault(require("../../../core/dto/jobs/jobDetails.dto"));
const jobDetailsResult_dto_1 = __importDefault(require("../../../core/dto/jobs/jobDetailsResult.dto"));
const notFoundError_1 = __importDefault(require("../../../core/errors/notFoundError"));
class GetJobById {
    constructor(jobRepository) {
        this.jobRepository = jobRepository;
    }
    async call(jobId) {
        const data = await this.jobRepository.getJobDetails(jobId);
        if (data === null) {
            throw new notFoundError_1.default(`Job with id:${jobId} not found`);
        }
        return mapper_1.default.map(data, jobDetailsResult_dto_1.default, jobDetails_dto_1.default);
    }
}
exports.default = GetJobById;
