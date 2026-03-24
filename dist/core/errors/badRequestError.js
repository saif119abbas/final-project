"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BadRequestError extends Error {
    constructor(message = "Provided data is invalid", details) {
        super(message);
        this.message = message;
        this.details = details;
        this.name = "Bad Request Error";
        this.httpStatus = 400;
    }
}
exports.default = BadRequestError;
