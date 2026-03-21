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
exports.Metrics = void 0;
const classes_1 = require("@automapper/classes");
const jobStatus_enum_1 = __importDefault(require("../../enum/jobStatus.enum"));
const actionType_enum_1 = __importDefault(require("../../enum/actionType.enum"));
class Metrics {
}
exports.Metrics = Metrics;
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Number)
], Metrics.prototype, "totalSubscribers", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Number)
], Metrics.prototype, "successfulDeliveries", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Number)
], Metrics.prototype, "failedDeliveries", void 0);
class JobDetails {
}
exports.default = JobDetails;
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], JobDetails.prototype, "id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], JobDetails.prototype, "pipeline", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], JobDetails.prototype, "actionType", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Array)
], JobDetails.prototype, "subscribers", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Object)
], JobDetails.prototype, "payload", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Object)
], JobDetails.prototype, "result", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], JobDetails.prototype, "status", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Date)
], JobDetails.prototype, "scheduledFor", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Object)
], JobDetails.prototype, "createdAt", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Metrics)
], JobDetails.prototype, "metrics", void 0);
