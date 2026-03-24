import { AutoMap } from "@automapper/classes";
import { Job } from "@core/models";
import { Metrics } from "./jobDetails.dto";
import ActionType from "@core/enum/actionType.enum";

class SubscriberResult {
  @AutoMap()
  url!: string | null;
}
class PipelineResult {
  @AutoMap()
  sourcePath!: string | null;
  @AutoMap()
  actionType!: ActionType;
}
export default class JobDetailsResult {
  @AutoMap()
  job!: Job;
  @AutoMap()
  pipeline!: PipelineResult | null;
  subscribers!: SubscriberResult[];
  @AutoMap()
  metrics!: Metrics;
}
