"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobs = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const index_1 = require("./index");
const jobStatus_enum_1 = __importDefault(require("../../../core/enum/jobStatus.enum"));
const jobStatus_pgEnum_1 = __importDefault(require("./jobStatus.pgEnum"));
exports.jobs = (0, pg_core_1.pgTable)("jobs", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    pipelineId: (0, pg_core_1.uuid)("pipeline_id").references(() => index_1.pipelines.id),
    payload: (0, pg_core_1.jsonb)("payload").$type().notNull(),
    status: (0, jobStatus_pgEnum_1.default)("status").default(jobStatus_enum_1.default.PENDING),
    result: (0, pg_core_1.jsonb)("result"),
    error: (0, pg_core_1.text)("error"),
    scheduledFor: (0, pg_core_1.timestamp)("scheduled_for"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});
