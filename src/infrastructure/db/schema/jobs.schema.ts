import { pgTable, timestamp, text, uuid, jsonb } from "drizzle-orm/pg-core";
import { pipelines } from "./index";
import JobStatus from "@core/enum/jobStatus.enum";

import jobStatusEnum from "./jobStatus.pgEnum";
import { Payload } from "@core/dto/jobs/jobRequest.dto";

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  pipelineId: uuid("pipeline_id").references(() => pipelines.id),
  payload: jsonb("payload").$type<Payload>().notNull(),
  status: jobStatusEnum("status").default(JobStatus.PENDING),
  result: jsonb("result"),
  error: text("error"),
  scheduledFor: timestamp("scheduled_for"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
