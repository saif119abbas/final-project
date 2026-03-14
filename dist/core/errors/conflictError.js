export default class ConflictError extends Error {
    name = "Conflict Error";
    httpStatus = 409;
    entity;
    identifier;
    value;
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
        this.entity = identifier ? entityOrMessage : "resource";
        this.identifier = identifier ?? "";
        this.value = value;
    }
}
