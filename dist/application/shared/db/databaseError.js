"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isDatabaseError;
const errors_1 = require("drizzle-orm/errors");
function isDatabaseError(error) {
    return (error instanceof errors_1.DrizzleQueryError &&
        typeof error.cause === "object" &&
        error.cause !== null &&
        "code" in error.cause);
}
