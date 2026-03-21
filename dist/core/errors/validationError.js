"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationError extends Error {
    constructor(message = "Provided data is invalid", details) {
        super(message);
        this.message = message;
        this.details = details;
        this.name = "ValidationError";
        this.httpStatus = 422;
    }
}
exports.default = ValidationError;
