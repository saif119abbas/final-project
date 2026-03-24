import { AutoMap } from "@automapper/classes";

export class User {
  @AutoMap()
  id!: string;

  @AutoMap()
  email!: string;

  @AutoMap()
  username!: string;

  @AutoMap()
  password!: string;

  @AutoMap()
  createdAt!: Date | null;

  @AutoMap()
  updatedAt!: Date | null;
}
