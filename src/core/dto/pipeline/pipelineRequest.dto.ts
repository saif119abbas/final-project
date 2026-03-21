import { AutoMap } from "@automapper/classes";
import ActionType from "@core/enum/actionType.enum";
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
  subscribers?: string[];
}
