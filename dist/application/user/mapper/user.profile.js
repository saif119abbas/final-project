"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userProfile;
require("reflect-metadata");
const core_1 = require("@automapper/core");
const userRequest_dto_1 = __importDefault(require("../../../core/dto/user/userRequest.dto"));
const user_model_1 = require("../../../core/models/user.model");
const mapper_1 = __importDefault(require("../../shared/mapper/mapper"));
const userResponse_dto_1 = __importDefault(require("../../../core/dto/user/userResponse.dto"));
function userProfile() {
    (0, core_1.createMap)(mapper_1.default, userRequest_dto_1.default, user_model_1.User, (0, core_1.forMember)((dest) => dest.id, (0, core_1.ignore)()), (0, core_1.forMember)((dest) => dest.createdAt, (0, core_1.ignore)()), (0, core_1.forMember)((dest) => dest.updatedAt, (0, core_1.ignore)()));
    (0, core_1.createMap)(mapper_1.default, user_model_1.User, userResponse_dto_1.default);
}
