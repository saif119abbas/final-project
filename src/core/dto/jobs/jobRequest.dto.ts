import { AutoMap } from "@automapper/classes";
export type Config = {
  url: string;
  method: string;
};
export type Payload<T = unknown, C = Config> = {
  data: T;
  config?: C;
};
export default class JobRequest {
  @AutoMap()
  payload!: Payload;
}
