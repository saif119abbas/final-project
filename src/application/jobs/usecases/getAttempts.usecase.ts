import JobAttemptsResponse from "@core/dto/jobs/jobAttemptsResponse.dto";
import NotFoundError from "@core/errors/notFoundError";
import { IJobRepository } from "@core/repositories/jobs";
import IUseCase from "@core/shared/useCase";
export default class GetAttemptsUsecase implements IUseCase<
  JobAttemptsResponse[]
> {
  constructor(private readonly jobRepository: IJobRepository) {}
  async call(jobId: string): Promise<JobAttemptsResponse[]> {
    const result = await this.jobRepository.getAttemptDetails(jobId);
    if (result === null) {
      throw new NotFoundError(`Job with id:${jobId} not found`);
    }
    return result;
  }
}
