import { AutoMap } from "@automapper/classes";
import ActionType from "@core/enum/actionType.enum";

export default class Pipeline {
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
  actionType!: ActionType;

  @AutoMap()
  createdAt!: Date | null;

  @AutoMap()
  updatedAt!: Date | null;
}
