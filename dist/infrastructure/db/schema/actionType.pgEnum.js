"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionType_enum_1 = __importDefault(require("../../../core/enum/actionType.enum"));
const pg_core_1 = require("drizzle-orm/pg-core");
const actionTypeEnum = (0, pg_core_1.pgEnum)("action_type", [
    actionType_enum_1.default.FORMAT_TEXT,
    actionType_enum_1.default.ADD_META,
    actionType_enum_1.default.FILTER_FIELDS,
]);
exports.default = actionTypeEnum;
