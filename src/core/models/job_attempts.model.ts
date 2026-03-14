import JobStatus  from "@core/enum/jobStatus.enum";
 type JonAttempts=   {
  id?: string;
  jobId: string,
  subscriberId: string,
  attemptNumber: number,
  responseCode: string,
  responseBody: string,
  createdAt: Date,
  status:JobStatus,
};
export default JonAttempts
