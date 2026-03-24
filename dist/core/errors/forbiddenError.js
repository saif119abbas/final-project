"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ForbiddenError extends Error {
    constructor(message = "Forbidden") {
        super(message);
        this.message = message;
        this.name = "Forbidden Error";
        this.httpStatus = 403;
    }
}
exports.default = ForbiddenError;
