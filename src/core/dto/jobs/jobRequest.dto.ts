import { AutoMap } from "@automapper/classes";
type AuthNone = { type: "none" };
type AuthBearer = { type: "bearer"; token: string };
type AuthApiKey = { type: "api_key"; header: string; value: string };
type AuthBasic = { type: "basic"; username: string; password: string };

export type Auth = AuthNone | AuthBearer | AuthApiKey | AuthBasic;

export type Config = {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  auth?: Auth;
  headers?: Record<string, string>;
};
export type Payload<T = unknown, C = Config> = {
  data: T;
  config?: C;
};
export default class JobRequest {
  @AutoMap()
  payload!: Payload;
}
