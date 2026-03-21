import { AutoMap } from "@automapper/classes";
import JobStatus from "@core/enum/jobStatus.enum";
import { Payload } from "./jobRequest.dto";
import ActionType from "@core/enum/actionType.enum";

export class Metrics {
  @AutoMap()
  totalSubscribers!: number;
  @AutoMap()
  successfulDeliveries!: number;
  @AutoMap()
  failedDeliveries!: number;
}
export default class JobDetails {
  @AutoMap()
  id!: string;

  @AutoMap()
  pipeline!: string;
  @AutoMap()
  actionType!: ActionType;

  @AutoMap()
  subscribers!: string[];

  @AutoMap()
  payload!: Payload;

  @AutoMap()
  result!: unknown | null;

  @AutoMap()
  status!: JobStatus;

  @AutoMap()
  scheduledFor!: Date;

  @AutoMap()
  createdAt!: Date | null;

  @AutoMap()
  metrics!: Metrics;
}
