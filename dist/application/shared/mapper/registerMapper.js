"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = registerMappers;
const job_profile_1 = __importDefault(require("../../jobs/mapper/job.profile"));
const pipeline_profile_1 = __importDefault(require("../../pipelines/mapper/pipeline.profile"));
const subscripers_profile_1 = __importDefault(require("../../pipelines/mapper/subscripers.profile"));
const refreshToken_mapper_1 = __importDefault(require("../../user/mapper/refreshToken.mapper"));
const user_profile_1 = __importDefault(require("../../user/mapper/user.profile"));
function registerMappers() {
    (0, user_profile_1.default)();
    (0, refreshToken_mapper_1.default)();
    (0, pipeline_profile_1.default)();
    (0, subscripers_profile_1.default)();
    (0, job_profile_1.default)();
}
