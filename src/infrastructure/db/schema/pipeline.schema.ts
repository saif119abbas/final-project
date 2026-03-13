import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import actionTypeEnum from "./actionType.pgEnum";

export const pipelines = pgTable("pipelines", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  source_path: text("source_path").notNull().unique(), // unique token for webhook URL
  action_type: actionTypeEnum("action_type").notNull(),
  action_config: jsonb("action_config"),               // optional config (e.g., { "url": "https://..." })
  created_at: timestamp("created_at").defaultNow(),
});