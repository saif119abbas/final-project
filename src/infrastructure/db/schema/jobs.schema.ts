import { pgTable, timestamp, text, uuid, jsonb, integer } from "drizzle-orm/pg-core";
import { pipelines } from "./index";
import JobStatus from "@core/enum/jobStatus.enum";

import jobStatusEnum from "./jobStatus.pgEnum";

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  pipeline_id: uuid("pipeline_id").references(() => pipelines.id),
  payload: jsonb("payload").notNull(),           // store as JSONB, not text, for easier querying
  status: jobStatusEnum("status").default(JobStatus.PENDING),
  result: jsonb("result"),                       // output of the processing action
  error: text("error"),                           // error message if processing failed
  scheduled_for: timestamp("scheduled_for"),      // when this job is eligible for processing (for retries)
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});