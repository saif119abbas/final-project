import { AutoMap } from "@automapper/classes";
import AttemptStatus from "@core/enum/attemptStatus.enum";
export default class JobAttemptsResponse {
  @AutoMap()
  jobId!: string;

  @AutoMap()
  attemptId!: string | null;

  @AutoMap()
  subscriberUrl!: string | null;

  @AutoMap()
  status!: AttemptStatus | null;

  @AutoMap()
  responseCode!: string | null;

  @AutoMap()
  responseBody!: string | null;

  @AutoMap()
  nextRetryAt!: Date | null;

  @AutoMap()
  createdAt!: Date | null;
}
