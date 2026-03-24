import BadRequestError from "@core/errors/badRequestError";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

function validate<T extends z.ZodType>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      throw new BadRequestError("Validation failed", errors);
    }

    req.body = result.data as z.infer<T>;
    next();
  };
}
export default validate;
