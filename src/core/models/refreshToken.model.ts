import { AutoMap } from "@automapper/classes";

export class RefreshToken {
  @AutoMap()
  id!: string;

  @AutoMap()
  userId!: string;

  @AutoMap()
  token!: string;

  @AutoMap()
  expiresAt!: Date;

  @AutoMap()
  revokedAt!: Date | null;

  @AutoMap()
  createdAt!: Date | null;

  @AutoMap()
  updatedAt!: Date | null;
}
