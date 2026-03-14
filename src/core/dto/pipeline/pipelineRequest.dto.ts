import { AutoMap } from "@automapper/classes";
import ActionType from "@core/enum/actionType.enum";
export default class PipelineRequest {
  @AutoMap()
  name!: string;
  @AutoMap()
  sourcePath!: string;
  @AutoMap()
  actionType!: ActionType;
  @AutoMap()
  actionConfig!: ActionType;
}
