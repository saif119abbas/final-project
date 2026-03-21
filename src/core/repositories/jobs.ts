import { Job } from "@core/models";
import IRepository from "./repository";
import JobDetailsResult from "@core/dto/jobs/jobDetailsResult.dto";
import JobAttemptsResponse from "@core/dto/jobs/jobAttemptsResponse.dto";
import JobResponse from "@core/dto/jobs/jobResponse.dto";
export interface IJobRepository extends IRepository<
  Job,
  Omit<Job, "updatedAt" | "createdAt">
> {
  getJobDetails(jobId: string): Promise<JobDetailsResult | null>;
  getAttemptDetails(jobId: string): Promise<JobAttemptsResponse[]>;
  getJobs(
    page: number,
    limit: number,
  ): Promise<{ data: JobResponse[]; total: number }>;
}
