import { Request, NextFunction, Response } from "express";
import IUseCase from "@core/shared/useCase";
import { created, noContent, ok } from "@presentation/http/responses/successResponse";
import PipelineResponse from "@core/dto/pipeline/pipelineRespone.dto";
import PipelineRequest from "@core/dto/pipeline/pipelineRequest.dto";
import PageResult from "@core/shared/pageResult";

export default class PipelineController {
  constructor(
    private readonly createUseCase: IUseCase<PipelineResponse>,
    private readonly updateUseCase: IUseCase<PipelineResponse>,
    private readonly deleteUseCase: IUseCase<void>,
    private readonly getAllUseCase: IUseCase<PageResult<PipelineResponse>>,
  ) {}

  createPipeline = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const pipeline: PipelineRequest = req.body;
      const data: PipelineResponse = await this.createUseCase.call(req.userId,pipeline);
      created(res, {
        message: "pipeline created successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };
  updatePipeline = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const pipeline: PipelineRequest = req.body;
       const id = req.params.id;
      const data: PipelineResponse = await this.updateUseCase.call(req.userId,id,pipeline);
      ok(res, {
        message: "pipeline updated successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };
  deletePipeline = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
       const id = req.params.id;
      await this.deleteUseCase.call(id);
      noContent(res)
    } catch (error) {
      next(error);
    }
  };
  getAllPipelines = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const page = Number(req.query.page) ?? 1;
      const limit = Number(req.query.limit) ?? 10;
      const data=await this.getAllUseCase.call(page,limit);
      ok(res, {
        message: "pipeline retrieved successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
