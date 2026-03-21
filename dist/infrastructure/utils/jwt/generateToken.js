"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateTokenPair;
const jwt_config_1 = __importDefault(require("../../../config/jwt.config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateTokenPair(payload) {
    const accessToken = jsonwebtoken_1.default.sign({ ...payload, jti: crypto.randomUUID() }, jwt_config_1.default.accessToken.secret, {
        expiresIn: jwt_config_1.default.accessToken.expiresIn,
        issuer: jwt_config_1.default.issuer,
        audience: jwt_config_1.default.audience,
    });
    const refreshToken = jsonwebtoken_1.default.sign({ ...payload, jti: crypto.randomUUID() }, jwt_config_1.default.refreshToken.secret, {
        expiresIn: jwt_config_1.default.refreshToken.expiresIn,
        issuer: jwt_config_1.default.issuer,
        audience: jwt_config_1.default.audience,
    });
    return { accessToken, refreshToken };
}
