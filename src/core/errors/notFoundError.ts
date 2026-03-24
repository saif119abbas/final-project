import IError from "@core/interfaces/error";

export default class NotFoundError extends Error implements IError {
  public name = "NotFoundError";
  public httpStatus = 404;

  // ── Overloads ─────────────────────────────
  constructor(message?: string);
  constructor(
    entity: string,
    field: string,
    value: string | number | Array<string | number>,
  );

  // ── Implementation ───────────────────────
  constructor(
    arg1: string = "Record",
    arg2?: string,
    arg3?: string | number | Array<string | number>,
  ) {
    let message: string;

    if (arg2 && arg3 !== undefined) {
      const values = Array.isArray(arg3) ? arg3.join(", ") : arg3;

      message = `${arg1} with ${arg2} (${values}) not found`;
    } else {
      message = arg1;
    }

    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
