"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
function errorHandler(err, _req, res, next) {
    if (res.headersSent) {
        next(err);
        return;
    }
    const isCustomError = "httpStatus" in err;
    const statusCode = isCustomError ? err.httpStatus : 500;
    const errorName = err.name || "InternalServerError";
    const message = err.message || "An unexpected error occurred";
    const details = "details" in err ? err.details : undefined;
    if (process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test") {
        console.error(`error: [${errorName}]`, err);
    }
    res.status(statusCode).json({
        success: false,
        error: {
            name: errorName,
            message,
            ...(details ? { details } : {}),
            ...(process.env.NODE_ENV !== "production" && err.stack
                ? { stack: err.stack }
                : {}),
        },
    });
}
