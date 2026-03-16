import { AutoMap } from "@automapper/classes";
import ActionType from "@core/enum/actionType.enum";
import { ActionConfig } from "./pipelineRequest.dto";

export default class PipelineResponse {
  @AutoMap()
  id!: string;

  @AutoMap()
  ownerId!: string;

  @AutoMap()
  name!: string;

  @AutoMap()
  description!: string | null;

  @AutoMap()
  sourcePath!: string;

  @AutoMap()
  ingestUrl!: string;

  @AutoMap()
  actionType!: ActionType;

  @AutoMap()
  actionConfig!: ActionConfig;

  @AutoMap()
  subscribers!: string[];

  @AutoMap()
  createdAt!: Date;

  @AutoMap()
  updatedAt!: Date;
}
