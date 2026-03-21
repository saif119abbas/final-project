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
const actionType_enum_1 = __importDefault(require("../enum/actionType.enum"));
class Pipeline {
}
exports.default = Pipeline;
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], Pipeline.prototype, "id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], Pipeline.prototype, "ownerId", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], Pipeline.prototype, "name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Object)
], Pipeline.prototype, "description", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], Pipeline.prototype, "sourcePath", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], Pipeline.prototype, "actionType", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Object)
], Pipeline.prototype, "createdAt", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Object)
], Pipeline.prototype, "updatedAt", void 0);
