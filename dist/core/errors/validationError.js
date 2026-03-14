export default class ValidationError extends Error {
    message;
    details;
    name = "ValidationError";
    httpStatus = 422;
    constructor(message = "Provided data is invalid", details) {
        super(message);
        this.message = message;
        this.details = details;
    }
}
