import { pgTable, timestamp, uuid, serial, text } from "drizzle-orm/pg-core";
import { jobs, subscribers } from "./index";
import JobStatus from "@core/enum/jobStatus.enum";
import jobStatusEnum from "../enum/jobStatus.pgEnum";
export const job_attempts = pgTable("job_attempts", {
    id: uuid("id").primaryKey().defaultRandom(),
    job_id: uuid("job_id").references(() => jobs.id),
    subscriber_id: uuid("subscriber_id").references(() => subscribers.id),
    attempt_number: serial("attempt_number"),
    response_code: text("response_code"),
    response_body: text("response_body"),
    created_at: timestamp("created_at").defaultNow(),
    status: jobStatusEnum("status").default(JobStatus.PENDING),
});
