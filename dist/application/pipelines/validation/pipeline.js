"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineRequestSchema = void 0;
const zod_1 = require("zod");
const actionType_enum_1 = __importDefault(require("../../../core/enum/actionType.enum"));
exports.PipelineRequestSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    description: zod_1.z.string().optional().nullable(),
    actionType: zod_1.z.enum(actionType_enum_1.default),
    subscribers: zod_1.z.array(zod_1.z.url()).optional(),
});
