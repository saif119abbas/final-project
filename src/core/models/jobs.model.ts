import  JobStatus  from "@core/enum/jobStatus.enum"

type jobs=  {
  id?: string;
  pipeline_id: string,
  payload: string,
  status:JobStatus,
  createdAt: Date
  updatedAt:Date,
  scheduledFor:Date,
};
export default jobs