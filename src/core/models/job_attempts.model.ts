import JobStatus  from "@core/enum/jobStatus.enum";
export default interface JonAttempts   {
  id: string
  jobId: string,
  subscriberId: string,
  attemptNumber: number,
  responseCode: string,
  responseBody: string,
  createdAt: Date,
  status:JobStatus,
};
