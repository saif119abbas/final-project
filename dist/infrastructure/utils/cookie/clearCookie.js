"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = clearCookie;
function clearCookie(res, key) {
    if (res) {
        res.clearCookie(key, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
    }
}
