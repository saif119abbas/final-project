import { pgEnum } from "drizzle-orm/pg-core";
var JobStatus;
(function (JobStatus) {
    JobStatus["PENDING"] = "PENDING";
    JobStatus["SUCCESS"] = "SUCCESS";
    JobStatus["FAILED"] = "FAILED";
})(JobStatus || (JobStatus = {}));
const jobStatusObj = {
    [JobStatus.PENDING]: JobStatus.PENDING,
    [JobStatus.SUCCESS]: JobStatus.SUCCESS,
    [JobStatus.FAILED]: JobStatus.FAILED,
};
const jobStatusEnum = pgEnum("job_status", jobStatusObj);
export { JobStatus, jobStatusEnum };
