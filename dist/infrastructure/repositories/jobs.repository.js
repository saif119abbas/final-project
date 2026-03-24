"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../db/schema");
const repository_1 = __importDefault(require("./repository"));
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
class JobRepository extends repository_1.default {
    constructor() {
        super(schema_1.jobs);
    }
    async getJobDetails(jobId) {
        const [row] = await db_1.db
            .select({
            job: schema_1.jobs,
            pipeline: {
                sourcePath: schema_1.pipelines.sourcePath,
                actionType: schema_1.pipelines.actionType
            }
        })
            .from(schema_1.jobs)
            .leftJoin(schema_1.pipelines, (0, drizzle_orm_1.eq)(schema_1.jobs.pipelineId, schema_1.pipelines.id))
            .where((0, drizzle_orm_1.eq)(schema_1.jobs.id, jobId))
            .limit(1);
        const subs = await db_1.db
            .select({
            url: schema_1.subscribers.url
        })
            .from(schema_1.subscribers)
            .where((0, drizzle_orm_1.eq)(schema_1.subscribers.pipelineId, row.job.pipelineId))
            .execute();
        if (!row)
            return null;
        console.log("row", row);
        const [metricsResult] = await db_1.db
            .select({
            total: (0, drizzle_orm_1.sql) `count(${schema_1.jobAttempts.id})`.mapWith(Number),
            success: (0, drizzle_orm_1.sql) `
      count(*) filter (where ${schema_1.jobAttempts.status} = 'SUCCESS')
    `.mapWith(Number),
            failed: (0, drizzle_orm_1.sql) `
      count(*) filter (where ${schema_1.jobAttempts.status} = 'FAILED')
    `.mapWith(Number)
        })
            .from(schema_1.jobAttempts)
            .where((0, drizzle_orm_1.eq)(schema_1.jobAttempts.jobId, jobId))
            .execute();
        console.log("metricsResult", metricsResult);
        return {
            job: row.job,
            pipeline: row.pipeline,
            subscribers: subs,
            metrics: {
                totalSubscribers: metricsResult?.total ?? 0,
                successfulDeliveries: metricsResult?.success ?? 0,
                failedDeliveries: metricsResult?.failed ?? 0
            }
        };
    }
    async getAttemptDetails(jobId) {
        const rows = await db_1.db
            .select({
            jobId: schema_1.jobs.id,
            attemptId: schema_1.jobAttempts.id,
            subscriberUrl: schema_1.subscribers.url,
            status: schema_1.jobAttempts.status,
            responseCode: schema_1.jobAttempts.responseCode,
            responseBody: schema_1.jobAttempts.responseBody,
            nextRetryAt: schema_1.jobAttempts.nextRetryAt,
            createdAt: schema_1.jobAttempts.createdAt,
        })
            .from(schema_1.jobs)
            .leftJoin(schema_1.pipelines, (0, drizzle_orm_1.eq)(schema_1.jobs.pipelineId, schema_1.pipelines.id))
            .leftJoin(schema_1.subscribers, (0, drizzle_orm_1.eq)(schema_1.subscribers.pipelineId, schema_1.pipelines.id))
            .leftJoin(schema_1.jobAttempts, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.jobAttempts.subscriberId, schema_1.subscribers.id), (0, drizzle_orm_1.eq)(schema_1.jobAttempts.jobId, schema_1.jobs.id)))
            .where((0, drizzle_orm_1.eq)(schema_1.jobs.id, jobId))
            .execute();
        return rows;
    }
    ;
    async getJobs(page, limit) {
        const offset = (page - 1) * limit;
        const data = await db_1.db
            .select({
            id: schema_1.jobs.id,
            pipeline: schema_1.pipelines.sourcePath,
            payload: schema_1.jobs.payload,
            jobStatus: schema_1.jobs.status,
            scheduledFor: schema_1.jobs.scheduledFor,
            createdAt: schema_1.jobs.createdAt,
        })
            .from(schema_1.jobs)
            .leftJoin(schema_1.pipelines, (0, drizzle_orm_1.eq)(schema_1.jobs.pipelineId, schema_1.pipelines.id))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.jobs.createdAt)) // newest first
            .limit(limit)
            .offset(offset)
            .execute();
        // 2️⃣ get total count of jobs
        const [totalResult] = await db_1.db
            .select({
            count: (0, drizzle_orm_1.sql) `count(*)`.mapWith(Number)
        })
            .from(schema_1.jobs)
            .execute();
        return {
            data,
            total: totalResult?.count ?? 0
        };
    }
}
exports.default = JobRepository;
