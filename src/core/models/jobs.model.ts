import { AutoMap } from "@automapper/classes";
import { Payload } from "@core/dto/jobs/jobRequest.dto";
import JobStatus from "@core/enum/jobStatus.enum";

export default class Job {
  @AutoMap()
  id!: string;

  @AutoMap()
  pipelineId!: string | null; // match DB nullable

  @AutoMap()
  payload!: Payload;

  @AutoMap()
  status!: JobStatus | null; // match DB nullable

  @AutoMap()
  result!: unknown | null; // add result

  @AutoMap()
  error!: string | null; // add error

  @AutoMap()
  scheduledFor!: Date | null; // match DB nullable

  @AutoMap()
  createdAt!: Date | null;

  @AutoMap()
  updatedAt!: Date | null;
}
