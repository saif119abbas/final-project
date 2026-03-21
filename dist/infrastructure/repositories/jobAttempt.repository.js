"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../db/schema");
const repository_1 = __importDefault(require("./repository"));
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
const attemptStatus_enum_1 = __importDefault(require("../../core/enum/attemptStatus.enum"));
class JobAttemptRepository extends repository_1.default {
    constructor() {
        super(schema_1.jobAttempts);
    }
    async findDueForRetry() {
        return db_1.db
            .select()
            .from(schema_1.jobAttempts)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.jobAttempts.status, attemptStatus_enum_1.default.RETRY), (0, drizzle_orm_1.lte)(schema_1.jobAttempts.nextRetryAt, new Date()), (0, drizzle_orm_1.lte)(schema_1.jobAttempts.attemptNumber, 5)));
    }
    async findByJobId(jobId) {
        const result = await db_1.db
            .select()
            .from(schema_1.jobAttempts)
            .where((0, drizzle_orm_1.eq)(schema_1.jobAttempts.jobId, jobId))
            .execute();
        return result;
    }
}
exports.default = JobAttemptRepository;
