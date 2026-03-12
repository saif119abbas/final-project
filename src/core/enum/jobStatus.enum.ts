import { pgEnum } from "drizzle-orm/pg-core";
enum JobStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}
const jobStatusObj: Record<JobStatus, JobStatus> = {
  [JobStatus.PENDING]: JobStatus.PENDING,
  [JobStatus.SUCCESS]: JobStatus.SUCCESS,
  [JobStatus.FAILED]: JobStatus.FAILED,
};
const jobStatusEnum = pgEnum("job_status", jobStatusObj);
export { JobStatus, jobStatusEnum };
