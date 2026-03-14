import { AutoMap } from "@automapper/classes";

export default class RefreshTokenRequest {
  @AutoMap()
  userId!: string;

  @AutoMap()
  token! :string

  @AutoMap()
  revokedAt!: Date | null;

  @AutoMap()
  expiresAt!: Date;
}