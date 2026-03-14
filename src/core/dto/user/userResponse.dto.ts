import { AutoMap } from "@automapper/classes";

export default class UserResponse {
  @AutoMap()
  id?: string;

  @AutoMap()
  email!: string;

  @AutoMap()
  username!: string;

}