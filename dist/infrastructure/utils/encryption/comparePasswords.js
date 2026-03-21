"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = compare;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function compare(password, hash) {
    return bcryptjs_1.default.compare(password, hash);
}
