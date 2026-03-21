"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = jobProfile;
const core_1 = require("@automapper/core");
const mapper_1 = __importDefault(require("../../shared/mapper/mapper"));
const models_1 = require("../../../core/models");
const jobRequest_dto_1 = __importDefault(require("../../../core/dto/jobs/jobRequest.dto"));
const jobStatus_enum_1 = __importDefault(require("../../../core/enum/jobStatus.enum"));
const jobResponse_dto_1 = __importDefault(require("../../../core/dto/jobs/jobResponse.dto"));
const jobDetails_dto_1 = __importDefault(require("../../../core/dto/jobs/jobDetails.dto"));
const jobDetailsResult_dto_1 = __importDefault(require("../../../core/dto/jobs/jobDetailsResult.dto"));
function jobProfile() {
    (0, core_1.createMap)(mapper_1.default, jobRequest_dto_1.default, models_1.Job, (0, core_1.forMember)((d) => d.payload, (0, core_1.mapFrom)((s) => s.payload)), (0, core_1.forMember)((dest) => dest.id, (0, core_1.ignore)()), (0, core_1.forMember)((dest) => dest.pipelineId, (0, core_1.ignore)()), (0, core_1.forMember)((dest) => dest.status, (0, core_1.mapFrom)(() => jobStatus_enum_1.default.PENDING)), (0, core_1.forMember)((dest) => dest.result, (0, core_1.ignore)()), (0, core_1.forMember)((dest) => dest.error, (0, core_1.ignore)()), (0, core_1.forMember)((dest) => dest.scheduledFor, (0, core_1.mapFrom)(() => new Date(Date.now() + 2 * 60 * 1000))), (0, core_1.forMember)((dest) => dest.createdAt, (0, core_1.ignore)()), (0, core_1.forMember)((dest) => dest.updatedAt, (0, core_1.ignore)()));
    (0, core_1.createMap)(mapper_1.default, models_1.Job, jobResponse_dto_1.default, (0, core_1.forMember)((dest) => dest.pipeline, (0, core_1.mapFrom)((src) => src.pipelineId)));
    (0, core_1.createMap)(mapper_1.default, jobDetailsResult_dto_1.default, jobDetails_dto_1.default, 
    // id
    (0, core_1.forMember)((dest) => dest.id, (0, core_1.mapFrom)((src) => src.job.id)), 
    // pipeline: string
    (0, core_1.forMember)((dest) => dest.pipeline, (0, core_1.mapFrom)((src) => src.pipeline?.sourcePath ?? "")), (0, core_1.forMember)((dest) => dest.actionType, (0, core_1.mapFrom)((src) => src.pipeline?.actionType ?? "")), 
    // subscribers: string[]
    (0, core_1.forMember)((dest) => dest.subscribers, (0, core_1.mapFrom)((src) => src.subscribers.map(s => s.url ?? ""))), 
    // payload
    (0, core_1.forMember)((dest) => dest.payload, (0, core_1.mapFrom)((src) => src.job.payload)), 
    // result
    (0, core_1.forMember)((dest) => dest.result, (0, core_1.mapFrom)((src) => src.job.result)), 
    // status
    (0, core_1.forMember)((dest) => dest.status, (0, core_1.mapFrom)((src) => src.job.status)), 
    // scheduledFor
    (0, core_1.forMember)((dest) => dest.scheduledFor, (0, core_1.mapFrom)((src) => src.job.scheduledFor)), 
    // createdAt
    (0, core_1.forMember)((dest) => dest.createdAt, (0, core_1.mapFrom)((src) => src.job.createdAt)), 
    // metrics (direct mapping works if structure matches)
    (0, core_1.forMember)((dest) => dest.metrics, (0, core_1.mapFrom)((src) => src.metrics)));
}
