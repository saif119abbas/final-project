"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipelines = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const actionType_pgEnum_1 = __importDefault(require("./actionType.pgEnum"));
const users_schema_1 = require("./users.schema"); // assuming you have a users table
exports.pipelines = (0, pg_core_1.pgTable)("pipelines", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description"),
    ownerId: (0, pg_core_1.uuid)("owner_id")
        .notNull()
        .references(() => users_schema_1.users.id),
    sourcePath: (0, pg_core_1.text)("source_path").notNull().unique(),
    actionType: (0, actionType_pgEnum_1.default)("action_type").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});
