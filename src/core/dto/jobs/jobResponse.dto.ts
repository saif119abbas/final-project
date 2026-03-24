import { AutoMap } from "@automapper/classes";
import JobStatus from "@core/enum/jobStatus.enum";
import { Payload } from "./jobRequest.dto";

export default class JobResponse {
  @AutoMap()
  id!: string;

  @AutoMap()
  pipeline!: string | null;

  @AutoMap()
  payload!: Payload;

  @AutoMap()
  jobStatus!: JobStatus | null;

  @AutoMap()
  scheduledFor!: Date | null;

  @AutoMap()
  createdAt!: Date | null;
}
