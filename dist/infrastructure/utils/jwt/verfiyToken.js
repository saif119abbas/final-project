"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = verfiyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verfiyToken(token, secret) {
    let verifyResult;
    try {
        verifyResult = jsonwebtoken_1.default.verify(token, secret);
    }
    catch {
        return null;
    }
    if (typeof verifyResult !== "object" ||
        !verifyResult ||
        !("id" in verifyResult) ||
        !("username" in verifyResult)) {
        return null;
    }
    const payload = {
        id: verifyResult.id,
        username: verifyResult.username,
    };
    return payload;
}
