import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import actionTypeEnum from "./actionType.pgEnum";
export const pipelines = pgTable("pipelines", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    sourcePath: text("source_path").notNull().unique(), // unique token for webhook URL
    actionType: actionTypeEnum("action_type").notNull(),
    actionConfig: jsonb("action_config"), // optional config (e.g., { "url": "https://..." })
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});
