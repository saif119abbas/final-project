"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UnauthorizedError extends Error {
    constructor(message = "Unauthorized") {
        super(message);
        this.message = message;
        this.name = "UnauthorizedError";
        this.httpStatus = 401;
    }
}
exports.default = UnauthorizedError;
