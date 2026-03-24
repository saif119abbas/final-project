import { AutoMap } from "@automapper/classes";
import AttemptStatus from "@core/enum/attemptStatus.enum";

export default class AttemptResponse {
  @AutoMap()
  id!: string;

  @AutoMap()
  subscriber!: string;

  @AutoMap()
  status!: AttemptStatus;

  @AutoMap()
  responseCode!: string | null;

  @AutoMap()
  responseBody!: string | null;

  @AutoMap()
  nextRetryAt!: Date | null;

  @AutoMap()
  createdAt!: Date | null;
}
