"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = setCookie;
const ms_1 = __importDefault(require("ms"));
function setCookie(refreshToken, res, key) {
    if (res) {
        res.cookie(key, refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: (0, ms_1.default)(process.env.JWT_REFRESH_EXPIRES_IN),
        });
    }
}
