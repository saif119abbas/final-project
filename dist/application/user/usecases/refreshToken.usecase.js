"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mapper_1 = __importDefault(require("../../shared/mapper/mapper"));
const jwt_config_1 = __importDefault(require("../../../config/jwt.config"));
const refreshTokenRequest_dto_1 = __importDefault(require("../../../core/dto/refreshToken/refreshTokenRequest.dto"));
const forbiddenError_1 = __importDefault(require("../../../core/errors/forbiddenError"));
const unauthorizedError_1 = __importDefault(require("../../../core/errors/unauthorizedError"));
const refreshToken_model_1 = require("../../../core/models/refreshToken.model");
const ms_1 = __importDefault(require("ms"));
class RefreshTokenUseCase {
    constructor(refreshTokenRepository, verifyToken, generateTokenPair, decodeToken, setRefreshTokenCookie, clearRefreshTokenCookie) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.verifyToken = verifyToken;
        this.generateTokenPair = generateTokenPair;
        this.decodeToken = decodeToken;
        this.setRefreshTokenCookie = setRefreshTokenCookie;
        this.clearRefreshTokenCookie = clearRefreshTokenCookie;
    }
    async call(userId, token, res) {
        if (!userId || !token) {
            throw new unauthorizedError_1.default("You should include access token");
        }
        const tokenPayload = this.decodeToken(token);
        if (tokenPayload === null) {
            throw new forbiddenError_1.default("Forbidden");
        }
        if (!userId || userId !== tokenPayload.id) {
            throw new unauthorizedError_1.default("You should include access token");
        }
        const refreshToken = await this.refreshTokenRepository.findByUserId(userId);
        if (!refreshToken) {
            throw new forbiddenError_1.default("The user is logged out");
        }
        const payload = this.verifyToken(refreshToken.token, jwt_config_1.default.refreshToken.secret);
        if (payload === null || payload.id !== userId) {
            throw new forbiddenError_1.default("You should use your token");
        }
        const tokenPair = this.generateTokenPair(payload);
        const refreshExpiresIn = (0, ms_1.default)(jwt_config_1.default.refreshToken.expiresIn);
        if (!refreshExpiresIn) {
            throw new Error("JWT_REFRESH_EXPIRES_IN is not defined or invalid");
        }
        const refreshTokenRequest = Object.assign(new refreshTokenRequest_dto_1.default(), {
            userId,
            revokedAt: null,
            token: tokenPair.refreshToken,
            expiresAt: new Date(Date.now() + refreshExpiresIn),
        });
        this.clearRefreshTokenCookie(res, "refreshToken");
        this.setRefreshTokenCookie(tokenPair.refreshToken, res, "refreshToken");
        const refrestTokenInstance = mapper_1.default.map(refreshTokenRequest, refreshTokenRequest_dto_1.default, refreshToken_model_1.RefreshToken);
        await this.refreshTokenRepository.create(refrestTokenInstance);
        return tokenPair.accessToken;
    }
}
exports.default = RefreshTokenUseCase;
