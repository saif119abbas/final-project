"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribers = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const index_1 = require("./index");
exports.subscribers = (0, pg_core_1.pgTable)("subscribers", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    pipelineId: (0, pg_core_1.uuid)("pipeline_id").references(() => index_1.pipelines.id),
    url: (0, pg_core_1.text)("url").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});
