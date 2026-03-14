import IError from "@core/interfaces/error";

export default class ForbiddenError extends Error implements IError {
  public name = "Forbidden Error";
  public httpStatus = 403;

  constructor(public message: string = "Forbidden") {
    super(message);
  }
}
