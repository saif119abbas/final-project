import NotFoundError from "@core/errors/notFoundError";
import { Pipeline } from "@core/models";
import IPipelineRepository from "@core/repositories/pipeline";
import IUseCase from "@core/shared/useCase";

export default class DeletePipelineUseCase implements IUseCase<void> {
  constructor(private readonly pipelineRepository: IPipelineRepository) {}
  async call(pipelineId: string): Promise<void> {
    const pipeline: Pipeline | null =
      await this.pipelineRepository.findById(pipelineId);
    if (pipeline === null) {
      throw new NotFoundError("pipeline", "id", pipelineId);
    }
    await this.pipelineRepository.delete(pipelineId);
  }
}
