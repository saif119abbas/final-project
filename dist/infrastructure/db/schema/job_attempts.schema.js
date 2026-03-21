"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobAttempts = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const index_1 = require("./index");
const attemptStatus_enum_1 = __importDefault(require("./attemptStatus.enum"));
const attemptStatus_enum_2 = __importDefault(require("../../../core/enum/attemptStatus.enum"));
exports.jobAttempts = (0, pg_core_1.pgTable)("job_attempts", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    jobId: (0, pg_core_1.uuid)("job_id").references(() => index_1.jobs.id),
    subscriberId: (0, pg_core_1.uuid)("subscriber_id").references(() => index_1.subscribers.id),
    attemptNumber: (0, pg_core_1.serial)("attempt_number"),
    responseCode: (0, pg_core_1.text)("response_code"),
    responseBody: (0, pg_core_1.text)("response_body"),
    status: (0, attemptStatus_enum_1.default)("status").default(attemptStatus_enum_2.default.PENDING),
    nextRetryAt: (0, pg_core_1.timestamp)("next_retry_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});
