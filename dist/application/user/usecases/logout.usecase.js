"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const forbiddenError_1 = __importDefault(require("@core/errors/forbiddenError"));
const unauthorizedError_1 = __importDefault(require("@core/errors/unauthorizedError"));
class LogoutUseCase {
    constructor(refreshTokenRepository, decodeToken, clearRefreshTokenCookie) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.decodeToken = decodeToken;
        this.clearRefreshTokenCookie = clearRefreshTokenCookie;
    }
    async call(userId, token, res) {
        if (!token) {
            throw new unauthorizedError_1.default("Invalid token");
        }
        const payload = this.decodeToken(token);
        if (!payload) {
            throw new unauthorizedError_1.default("Invalid token");
        }
        console.log("from logout", payload);
        if (userId !== payload.id) {
            throw new forbiddenError_1.default("Not allowed to use another token");
        }
        const result = await this.refreshTokenRepository.revokedUserTokens(userId);
        if (!result) {
            throw new unauthorizedError_1.default("Failed to logout");
        }
        this.clearRefreshTokenCookie(res, "refreshToken");
        return true;
    }
}
exports.default = LogoutUseCase;
