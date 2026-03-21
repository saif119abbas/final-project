"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pageResult_1 = __importDefault(require("../../../core/shared/pageResult"));
class getJobsUsecase {
    constructor(jobRepository) {
        this.jobRepository = jobRepository;
    }
    async call(page = 1, limit = 10) {
        const { data, total } = await this.jobRepository.getJobs(page, limit);
        const result = new pageResult_1.default(data, total, page, limit);
        return result;
    }
}
exports.default = getJobsUsecase;
