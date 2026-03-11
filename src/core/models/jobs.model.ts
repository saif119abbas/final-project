import { pgTable, timestamp, text, uuid } from "drizzle-orm/pg-core";
import {pipelines} from "./index"
import {JobStatus,jobStatusEnum} from "@core/enum/jobStatus.enum";
export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  pipeline_id: uuid("pipeline_id").references(() => pipelines.id),
  payload: text("payload").notNull(),
 status: jobStatusEnum("status").default(JobStatus.PENDING),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});