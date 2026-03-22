import { AutoMap } from "@automapper/classes";

export default class Subscriber {
  @AutoMap()
  id!: string;
  @AutoMap()
  pipelineId!: string ;
  @AutoMap()
  url!: string;
  @AutoMap()
  createdAt!: Date | null;
  @AutoMap()
  updatedAt!: Date;
}
