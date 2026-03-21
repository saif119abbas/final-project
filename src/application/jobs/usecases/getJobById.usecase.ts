import mapper from "@application/shared/mapper/mapper";
import JobDetails from "@core/dto/jobs/jobDetails.dto";
import JobDetailsResult from "@core/dto/jobs/jobDetailsResult.dto";
import NotFoundError from "@core/errors/notFoundError";
import { IJobRepository } from "@core/repositories/jobs";

import IUseCase from "@core/shared/useCase";

export default class GetJobById implements IUseCase<JobDetails> {
  constructor(private readonly jobRepository: IJobRepository) {}
  async call(jobId: string): Promise<JobDetails> {
    const data = await this.jobRepository.getJobDetails(jobId);
    if (data === null) {
      throw new NotFoundError(`Job with id:${jobId} not found`);
    }
    return mapper.map(data, JobDetailsResult, JobDetails);
  }
}
