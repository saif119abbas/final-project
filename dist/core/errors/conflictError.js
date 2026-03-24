"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConflictError extends Error {
    constructor(entityOrMessage, identifier, value) {
        const formattedValue = Array.isArray(value)
            ? value.map((v) => `'${v}'`).join(", ")
            : value
                ? `'${value}'`
                : "";
        const message = identifier === undefined
            ? entityOrMessage
            : `${entityOrMessage} with ${identifier}${formattedValue ? ` ${formattedValue}` : ""} already exists`;
        super(message);
        this.name = "Conflict Error";
        this.httpStatus = 409;
        this.entity = identifier ? entityOrMessage : "resource";
        this.identifier = identifier ?? "";
        this.value = value;
    }
}
exports.default = ConflictError;
