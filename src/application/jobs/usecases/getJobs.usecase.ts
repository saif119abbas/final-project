import JobResponse from "@core/dto/jobs/jobResponse.dto";
import { IJobRepository } from "@core/repositories/jobs";
import PageResult from "@core/shared/pageResult";
import IUseCase from "@core/shared/useCase";
export default class getJobsUsecase implements IUseCase<
  PageResult<JobResponse>
> {
  constructor(private readonly jobRepository: IJobRepository) {}
  async call(
    page: number = 1,
    limit: number = 10,
  ): Promise<PageResult<JobResponse>> {
    const { data, total } = await this.jobRepository.getJobs(page, limit);
    const result = new PageResult(data, total, page, limit);
    return result;
  }
}
