"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jobStatus_enum_1 = __importDefault(require("../../../core/enum/jobStatus.enum"));
const pg_core_1 = require("drizzle-orm/pg-core");
const jobStatusEnum = (0, pg_core_1.pgEnum)("job_status", [
    jobStatus_enum_1.default.PENDING,
    jobStatus_enum_1.default.SUCCESS,
    jobStatus_enum_1.default.FAILED,
    jobStatus_enum_1.default.PROCESSING,
    jobStatus_enum_1.default.PARTIAL,
]);
exports.default = jobStatusEnum;
