import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { pipelines } from "./index";
export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
   pipelineId: uuid("pipeline_id")
    .notNull()
    .references(() => pipelines.id, {
      onDelete: "cascade",
    }),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
