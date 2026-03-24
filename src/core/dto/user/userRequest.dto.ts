import { AutoMap } from "@automapper/classes";

export default class UserRequest {
  @AutoMap()
  email!: string;

  @AutoMap()
  username!: string;

  @AutoMap()
  password!: string;
}
