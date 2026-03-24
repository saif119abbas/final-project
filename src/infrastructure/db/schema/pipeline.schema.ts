import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import actionTypeEnum from "./actionType.pgEnum";
import { users } from "./users.schema"; // assuming you have a users table

export const pipelines = pgTable("pipelines", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: text("name").notNull(),
  description: text("description"),

  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id),

  sourcePath: text("source_path").notNull().unique(),

  actionType: actionTypeEnum("action_type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
