"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = pipelineProfile;
const core_1 = require("@automapper/core");
const mapper_1 = __importDefault(require("../../shared/mapper/mapper"));
const pipelineRequest_dto_1 = __importDefault(require("../../../core/dto/pipeline/pipelineRequest.dto"));
const pipelineRespone_dto_1 = __importDefault(require("../../../core/dto/pipeline/pipelineRespone.dto"));
const models_1 = require("../../../core/models");
function pipelineProfile() {
    (0, core_1.createMap)(mapper_1.default, pipelineRequest_dto_1.default, models_1.Pipeline, (0, core_1.forMember)((dest) => dest.id, (0, core_1.ignore)()), (0, core_1.forMember)((dest) => dest.createdAt, (0, core_1.ignore)()), (0, core_1.forMember)((dest) => dest.updatedAt, (0, core_1.ignore)()));
    (0, core_1.createMap)(mapper_1.default, models_1.Pipeline, pipelineRespone_dto_1.default);
}
