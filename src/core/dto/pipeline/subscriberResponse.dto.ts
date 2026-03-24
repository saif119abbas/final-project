import { AutoMap } from "@automapper/classes";

export default class SubscriberResponse {
  @AutoMap()
  id!: string;

  @AutoMap()
  url!: string;
}
