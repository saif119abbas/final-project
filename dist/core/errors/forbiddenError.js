export default class ForbiddenError extends Error {
    message;
    name = "Forbidden Error";
    httpStatus = 403;
    constructor(message = "Forbidden") {
        super(message);
        this.message = message;
    }
}
