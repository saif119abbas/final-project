"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = encryptPassword;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function encryptPassword(password) {
    const salt = bcryptjs_1.default.genSaltSync(12);
    return bcryptjs_1.default.hashSync(password, salt);
}
