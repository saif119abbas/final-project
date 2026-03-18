"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_config_1 = __importDefault(require("@config/jwt.config"));
const unauthorizedError_1 = __importDefault(require("@core/errors/unauthorizedError"));
const verfiyToken_1 = __importDefault(require("@infrastructure/utils/jwt/verfiyToken"));
class AuthenticationMiddleware {
    constructor(findUserByIdUseCase) {
        this.findUserByIdUseCase = findUserByIdUseCase;
        this.authentication = async (req, res, next) => {
            try {
                const token = req.header("Authorization")?.replace("Bearer ", "");
                console.log("token", token);
                if (!token) {
                    throw new unauthorizedError_1.default("Unauthorized access");
                }
                const verifyResult = (0, verfiyToken_1.default)(token, jwt_config_1.default.accessToken.secret);
                if (!verifyResult) {
                    throw new unauthorizedError_1.default("Unauthorized access");
                }
                const decoded = verifyResult;
                const userId = decoded.id;
                const user = await this.findUserByIdUseCase.call(userId);
                if (user === null) {
                    throw new unauthorizedError_1.default("Unfound");
                }
                req.userId = userId;
                req.token = token;
                next();
            }
            catch (error) {
                next(error);
            }
        };
        this.verfiyRefreshToken = () => {
            return async (req, res, next) => {
                console.log();
                const refreshToken = req.cookies?.refreshToken;
                if (!refreshToken) {
                    throw new unauthorizedError_1.default("Refresh token not found");
                }
                const verifyResult = (0, verfiyToken_1.default)(refreshToken, jwt_config_1.default.refreshToken.secret);
                if (!verifyResult) {
                    throw new unauthorizedError_1.default("Refresh token not found");
                }
                const payload = verifyResult;
                const userId = payload.id;
                const user = await this.findUserByIdUseCase.call(userId);
                if (!user) {
                    throw new unauthorizedError_1.default("User not found");
                }
                req.token = refreshToken;
                req.userId = userId;
                next();
            };
        };
    }
}
exports.default = AuthenticationMiddleware;
