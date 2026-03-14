import { AutoMap } from "@automapper/classes";

export default class LoginRequest {
  @AutoMap()
  email!: string;
  
  @AutoMap()
  password!: string;
}