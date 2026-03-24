import { AutoMap } from "@automapper/classes";
import AttemptStatus from "@core/enum/attemptStatus.enum";

export default class JobAttempts {
  @AutoMap()
  id!: string;

  @AutoMap()
  jobId!: string | null;

  @AutoMap()
  subscriberId!: string | null;

  @AutoMap()
  attemptNumber!: number;

  @AutoMap()
  responseCode!: string | null;

  @AutoMap()
  responseBody!: string | null;

  @AutoMap()
  status!: AttemptStatus | null;

  @AutoMap()
  nextRetryAt!: Date | null;

  @AutoMap()
  createdAt!: Date | null;

  @AutoMap()
  updatedAt!: Date; // ✅ not null in DB
}
