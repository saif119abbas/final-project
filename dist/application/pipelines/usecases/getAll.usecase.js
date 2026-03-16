"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mapper_1 = __importDefault(require("@application/shared/mapper/mapper"));
const pipelineRespone_dto_1 = __importDefault(require("@core/dto/pipeline/pipelineRespone.dto"));
const models_1 = require("@core/models");
const pageResult_1 = __importDefault(require("@core/shared/pageResult"));
class GetAllPipelinesUseCase {
    constructor(pipelineRepository) {
        this.pipelineRepository = pipelineRepository;
    }
    async call(page = 1, limit = 10) {
        const { data, total } = await this.pipelineRepository.findAll(page, limit);
        const companies = mapper_1.default.mapArray(data, models_1.Pipeline, pipelineRespone_dto_1.default);
        const pageResult = new pageResult_1.default(companies, total, page, limit);
        return {
            items: companies,
            total,
            totalPages: pageResult.totalPages,
            itemsFrom: pageResult.itemsFrom,
            itemsTo: pageResult.itemsTo,
            limit: pageResult.limit,
        };
    }
}
exports.default = GetAllPipelinesUseCase;
