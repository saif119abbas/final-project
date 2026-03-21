"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NotFoundError extends Error {
    // ── Implementation ───────────────────────
    constructor(arg1 = "Record", arg2, arg3) {
        let message;
        if (arg2 && arg3 !== undefined) {
            const values = Array.isArray(arg3) ? arg3.join(", ") : arg3;
            message = `${arg1} with ${arg2} (${values}) not found`;
        }
        else {
            message = arg1;
        }
        super(message);
        this.name = "NotFoundError";
        this.httpStatus = 404;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.default = NotFoundError;
