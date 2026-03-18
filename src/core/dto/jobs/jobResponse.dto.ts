import { AutoMap } from "@automapper/classes";
import JobStatus from "@core/enum/jobStatus.enum";
import { Payload } from "./jobRequest.dto";

export default class JobResponse {
  @AutoMap()
  id!: string;

  @AutoMap()
  pipelineid!: string;

  @AutoMap()
  payload!: Payload;

  @AutoMap()
  status!: JobStatus;

  @AutoMap()
  scheduledFor!: Date;

  @AutoMap()
  createdAt!: Date | null;

  @AutoMap()
  updatedAt!: Date | null;
}
