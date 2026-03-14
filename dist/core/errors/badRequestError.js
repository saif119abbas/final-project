export default class BadRequestError extends Error {
    message;
    name = "Bad Request Error";
    httpStatus = 400;
    constructor(message = "Bad Request") {
        super(message);
        this.message = message;
    }
}
