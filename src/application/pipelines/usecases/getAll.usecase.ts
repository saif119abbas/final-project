import mapper from "@application/shared/mapper/mapper";
import PipelineResponse from "@core/dto/pipeline/pipelineRespone.dto";
import { Pipeline } from "@core/models";
import IPipelineRepository from "@core/repositories/pipeline";
import PageResult from "@core/shared/pageResult";
import IUseCase from "@core/shared/useCase";

export default class GetAllPipelinesUseCase implements IUseCase<
  PageResult<PipelineResponse>
> {
  constructor(private readonly pipelineRepository: IPipelineRepository) {}

  async call(
    page: number = 1,
    limit: number = 10,
  ): Promise<PageResult<PipelineResponse>> {
    const { data, total } = await this.pipelineRepository.findAll(page, limit);

    const companies = mapper.mapArray(data, Pipeline, PipelineResponse);

    const pageResult = new PageResult(companies, total, page, limit);

    return {
      items: companies,
      total,
      totalPages: pageResult.totalPages,
      itemsFrom: pageResult.itemsFrom,
      itemsTo: pageResult.itemsTo,
      limit: pageResult.limit,
    };
  }
}
