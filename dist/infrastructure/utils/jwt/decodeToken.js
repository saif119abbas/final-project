"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = verifyToken;
const unauthorizedError_1 = __importDefault(require("../../../core/errors/unauthorizedError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verifyToken(token) {
    // Verify token and get payload
    const decoded = jsonwebtoken_1.default.decode(token);
    if (!decoded ||
        typeof decoded !== "object" ||
        !("id" in decoded) ||
        !("username" in decoded)) {
        throw new unauthorizedError_1.default("Invalid token");
    }
    const payload = {
        id: decoded.id,
        username: decoded.username,
    };
    return payload;
}
