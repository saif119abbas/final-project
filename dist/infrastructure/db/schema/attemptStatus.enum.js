"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const attemptStatus_enum_1 = __importDefault(require("../../../core/enum/attemptStatus.enum"));
const pg_core_1 = require("drizzle-orm/pg-core");
const attemptStatusEnum = (0, pg_core_1.pgEnum)("attempt_status", [
    attemptStatus_enum_1.default.PENDING,
    attemptStatus_enum_1.default.SUCCESS,
    attemptStatus_enum_1.default.FAILED,
    attemptStatus_enum_1.default.RETRY
]);
exports.default = attemptStatusEnum;
