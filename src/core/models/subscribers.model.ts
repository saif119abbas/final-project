import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import {pipelines} from "./index"
export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  pipeline_id: uuid("pipeline_id").references(() => pipelines.id),
  url: text("url").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});