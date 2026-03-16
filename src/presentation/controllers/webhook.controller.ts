import IUseCase from "@core/shared/useCase";
import { Request, Response, NextFunction } from "express";

export default class WebhookController {
  constructor(
  private readonly ingestUsecase: IUseCase<{jobId:string}>,
  ) {}

  ingest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sourcePathParam = req.params.sourcePath;
      const payload=req.body
      const data=await this.ingestUsecase.call(sourcePathParam,payload)
      res.status(202).json({
        ok: true,
        message: "queued",
        data,
      });
    } catch (err) {
      next(err);
    }
  };
}
