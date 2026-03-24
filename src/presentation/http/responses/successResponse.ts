import SuccessOptions from "@core/interfaces/http responses/successOptions";
import { Response } from "express";

import { HttpStatusSuccess } from "@core/enum/httpStatusSuccess";

export function ok<T>(res: Response, options: SuccessOptions<T>): void {
  res.status(HttpStatusSuccess.OK).json({
    success: true,
    message: options.message,
    data: options.data,
  });
}

export function created<T>(res: Response, options: SuccessOptions<T>): void {
  res.status(HttpStatusSuccess.CREATED).json({
    success: true,
    message: options.message,
    data: options.data,
  });
}

export function noContent(res: Response): void {
  res.sendStatus(HttpStatusSuccess.NO_CONTENT);
}
