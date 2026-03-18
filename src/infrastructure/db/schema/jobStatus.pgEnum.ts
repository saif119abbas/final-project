import JobStatus from "@core/enum/jobStatus.enum";
import { pgEnum } from "drizzle-orm/pg-core";
const jobStatusEnum = pgEnum("job_status", [
  JobStatus.PENDING,
  JobStatus.SUCCESS,
  JobStatus.FAILED,
  JobStatus.PROCESSING,
]);
export default jobStatusEnum;
