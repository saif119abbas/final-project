import AttemptStatus from "@core/enum/attemptStatus.enum";
import { pgEnum } from "drizzle-orm/pg-core";
const attemptStatusEnum = pgEnum("attempt_status", [
  AttemptStatus.PENDING,
  AttemptStatus.SUCCESS,
  AttemptStatus.FAILED,
  AttemptStatus.RETRY,
]);
export default attemptStatusEnum;
