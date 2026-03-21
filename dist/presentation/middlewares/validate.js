"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const badRequestError_1 = __importDefault(require("../../core/errors/badRequestError"));
function validate(schema) {
    return (req, _res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }));
            throw new badRequestError_1.default("Validation failed", errors);
        }
        req.body = result.data;
        next();
    };
}
exports.default = validate;
