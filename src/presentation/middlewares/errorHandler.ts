import { Request, Response } from "express";

import IError from "@core/interfaces/error";

export default function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
): void {
  const isCustomError = "httpStatus" in err;

  const statusCode = isCustomError ? (err as IError).httpStatus : 500;
  const errorName = err.name || "InternalServerError";
  const message = err.message || "An unexpected error occurred";

  const details =
    "details" in err ? (err as { details?: unknown }).details : undefined;

  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test"
  ) {
    console.error(`error: [${errorName}]`, err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      name: errorName,
      message,
      ...(details ? { details } : {}),
      ...(process.env.NODE_ENV !== "production" && err.stack
        ? { stack: err.stack }
        : {}),
    },
  });
}
