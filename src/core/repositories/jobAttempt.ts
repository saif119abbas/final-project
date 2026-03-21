import { JobAttempt } from "@core/models";
import IRepository from "./repository";
export default interface IJobAttemptReposiory extends IRepository<
  JobAttempt,
  Omit<JobAttempt, "updatedAt" | "createdAt">
> {
  findDueForRetry(): Promise<JobAttempt[]>;
  findByJobId(jobId: string): Promise<JobAttempt[]>;
}
