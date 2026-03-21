"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = subscripersProfile;
const core_1 = require("@automapper/core");
const mapper_1 = __importDefault(require("../../shared/mapper/mapper"));
const models_1 = require("../../../core/models");
const subscriberResponse_dto_1 = __importDefault(require("../../../core/dto/pipeline/subscriberResponse.dto"));
function subscripersProfile() {
    (0, core_1.createMap)(mapper_1.default, models_1.Subscriber, subscriberResponse_dto_1.default);
}
