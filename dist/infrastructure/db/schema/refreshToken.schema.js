"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokens = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const users_schema_1 = require("./users.schema");
exports.refreshTokens = (0, pg_core_1.pgTable)("refresh_tokens", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    token: (0, pg_core_1.varchar)("token").notNull().unique(),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    revokedAt: (0, pg_core_1.timestamp)("revoked_at"),
    expiresAt: (0, pg_core_1.timestamp)("expires_at").notNull(),
    userId: (0, pg_core_1.uuid)("user_id")
        .notNull()
        .references(() => users_schema_1.users.id, { onDelete: "cascade" }),
});
