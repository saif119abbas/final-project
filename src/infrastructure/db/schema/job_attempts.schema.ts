import { pgTable, timestamp, uuid, serial, text } from "drizzle-orm/pg-core";
import { jobs, subscribers } from "./index";
import attemptStatusEnum from "./attemptStatus.enum";
import AttemptStatus from "@core/enum/attemptStatus.enum";
export const jobAttempts = pgTable("job_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id").references(() => jobs.id),
  subscriberId: uuid("subscriber_id").references(() => subscribers.id),
  attemptNumber: serial("attempt_number"),
  responseCode: text("response_code"),
  responseBody: text("response_body"),
  status: attemptStatusEnum("status").default(AttemptStatus.PENDING),
  nextRetryAt: timestamp("next_retry_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
