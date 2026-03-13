import  JobStatus  from "@core/enum/jobStatus.enum"

export default interface jobs  {
  id: string
  pipeline_id: string,
  payload: string,
  status:JobStatus,
  createdAt: Date
  updatedAt:Date,
  scheduledFor:Date,
};
