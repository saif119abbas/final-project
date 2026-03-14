import IError from "@core/interfaces/error";

export default class UnauthorizedError extends Error implements IError {
  public name = "UnauthorizedError";
  public httpStatus = 401;

  constructor(public message: string = "Unauthorized") {
    super(message);
  }
}
