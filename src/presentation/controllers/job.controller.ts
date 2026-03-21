import JobAttemptsResponse from "@core/dto/jobs/jobAttemptsResponse.dto";
import JobDetails from "@core/dto/jobs/jobDetails.dto";
import JobResponse from "@core/dto/jobs/jobResponse.dto";
import PageResult from "@core/shared/pageResult";
import IUseCase from "@core/shared/useCase";
import { ok } from "@presentation/http/responses/successResponse";
import { Request, Response, NextFunction } from "express";

export default class JobController {
  constructor(
    private readonly ingestUsecase: IUseCase<{ jobId: string }>,
    private readonly getJobDeatailsUsecase: IUseCase<JobDetails>,
    private readonly getAttemptsUsecase: IUseCase<JobAttemptsResponse[]>,
    private readonly getJobsUsecase: IUseCase<PageResult<JobResponse>>,
  ) {}

  ingest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sourcePathParam = req.params.sourcePath;
      const payload = req.body;
      const data = await this.ingestUsecase.call(sourcePathParam, payload);
      res.status(202).json({
        ok: true,
        message: "queued",
        data,
      });
    } catch (err) {
      next(err);
    }
  };
  getJobDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobId = req.params.id;
      const data = await this.getJobDeatailsUsecase.call(jobId);
      ok(res, {
        message: "job details retrieved successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  };
  getAttempts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobId = req.params.id;
      const data = await this.getAttemptsUsecase.call(jobId);
      ok(res, {
        message: "job attempts retrieved successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  };
  getJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page as string;
      const limit = req.query.limit as string;
      const data = await this.getJobsUsecase.call(
        parseInt(page),
        parseInt(limit),
      );
      ok(res, {
        message: "jobs retrieved successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  };
}
