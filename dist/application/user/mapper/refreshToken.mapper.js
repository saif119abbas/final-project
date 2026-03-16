"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = refreshTokenProfile;
require("reflect-metadata");
const core_1 = require("@automapper/core");
const mapper_1 = __importDefault(require("@application/shared/mapper/mapper"));
const refreshTokenRequest_dto_1 = __importDefault(require("@core/dto/refreshToken/refreshTokenRequest.dto"));
const refreshToken_model_1 = require("@core/models/refreshToken.model");
function refreshTokenProfile() {
    (0, core_1.createMap)(mapper_1.default, refreshTokenRequest_dto_1.default, refreshToken_model_1.RefreshToken, (0, core_1.forMember)((dest) => dest.id, (0, core_1.ignore)()), (0, core_1.forMember)((dest) => dest.createdAt, (0, core_1.ignore)()), (0, core_1.forMember)((dest) => dest.updatedAt, (0, core_1.ignore)()), (0, core_1.forMember)((dest) => dest.revokedAt, (0, core_1.mapFrom)((src) => src.revokedAt)), (0, core_1.forMember)((dest) => dest.expiresAt, (0, core_1.mapFrom)((src) => src.expiresAt ?? null)));
}
