import { AutoMap } from "@automapper/classes";
import ActionType from "@core/enum/actionType.enum";
import type { ActionConfig } from "@core/models/pipeline.model";
export default class PipelineRequest {
  @AutoMap()
  name!: string;
  @AutoMap()
  description?: string | null;
  @AutoMap()
  sourcePath!: string;
  @AutoMap()
  actionType!: ActionType;
  @AutoMap()
  actionConfig!: ActionConfig;
  @AutoMap()
  subscribers?: string[];
}
