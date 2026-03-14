export default class UnauthorizedError extends Error {
    message;
    name = "UnauthorizedError";
    httpStatus = 401;
    constructor(message = "Unauthorized") {
        super(message);
        this.message = message;
    }
}
