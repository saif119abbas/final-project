"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mapper_1 = __importDefault(require("../../shared/mapper/mapper"));
const jwt_config_1 = __importDefault(require("../../../config/jwt.config"));
const refreshTokenRequest_dto_1 = __importDefault(require("../../../core/dto/refreshToken/refreshTokenRequest.dto"));
const unauthorizedError_1 = __importDefault(require("../../../core/errors/unauthorizedError"));
const refreshToken_model_1 = require("../../../core/models/refreshToken.model");
const ms_1 = __importDefault(require("ms"));
class LoginUseCase {
    constructor(userRepository, refreshTokenRepository, generateTokenPair, compare, setRefreshTokenCookie) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.generateTokenPair = generateTokenPair;
        this.compare = compare;
        this.setRefreshTokenCookie = setRefreshTokenCookie;
    }
    async call(credentials, res) {
        const { email, password } = credentials;
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new unauthorizedError_1.default("Invalid username or password");
        }
        const isPasswordCorrect = await this.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new unauthorizedError_1.default("Invalid username or password");
        }
        const payload = {
            id: user.id,
            username: user.username,
            companyId: "companyId" in user ? user.companyId : undefined,
        };
        const { accessToken, refreshToken } = this.generateTokenPair(payload);
        const refreshExpiresIn = (0, ms_1.default)(jwt_config_1.default.refreshToken.expiresIn);
        if (!refreshExpiresIn) {
            throw new Error("JWT_REFRESH_EXPIRES_IN is not defined or invalid");
        }
        const refreshTokenRequest = Object.assign(new refreshTokenRequest_dto_1.default(), {
            userId: user.id,
            revokedAt: null,
            token: refreshToken,
            expiresAt: new Date(Date.now() + refreshExpiresIn),
        });
        const refrestTokenInstance = mapper_1.default.map(refreshTokenRequest, refreshTokenRequest_dto_1.default, refreshToken_model_1.RefreshToken);
        await this.refreshTokenRepository.create(refrestTokenInstance);
        this.setRefreshTokenCookie(refreshToken, res, "refreshToken");
        const response = {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
            accessToken,
        };
        return response;
    }
}
exports.default = LoginUseCase;
