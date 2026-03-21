"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammarify_1 = __importDefault(require("grammarify"));
class FormatTextAction {
    async execute(payload) {
        return {
            ...payload,
            data: (0, grammarify_1.default)(payload.data)
        };
    }
}
exports.default = FormatTextAction;
