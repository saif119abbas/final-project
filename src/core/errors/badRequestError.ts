import IError from "@core/interfaces/error";

export default class BadRequestError extends Error implements IError {
    public name = "Bad Request Error";
    public httpStatus = 400;

     constructor(
        public message: string = "Provided data is invalid",
        public details?: { field: string; message: string }[] | string[],
    ) {
        super(message);
    }
}
