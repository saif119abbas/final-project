"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("@automapper/classes");
const actionType_enum_1 = __importDefault(require("@core/enum/actionType.enum"));
class PipelineResponse {
}
exports.default = PipelineResponse;
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], PipelineResponse.prototype, "id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], PipelineResponse.prototype, "ownerId", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], PipelineResponse.prototype, "name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Object)
], PipelineResponse.prototype, "description", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], PipelineResponse.prototype, "sourcePath", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], PipelineResponse.prototype, "ingestUrl", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], PipelineResponse.prototype, "actionType", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Object)
], PipelineResponse.prototype, "actionConfig", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Array)
], PipelineResponse.prototype, "subscribers", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Date)
], PipelineResponse.prototype, "createdAt", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Date)
], PipelineResponse.prototype, "updatedAt", void 0);
