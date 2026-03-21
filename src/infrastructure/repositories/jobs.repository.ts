import {
  jobs,
  pipelines,
  subscribers,
  jobAttempts,
} from "@infrastructure/db/schema";
import Repository from "./repository";
import { IJobRepository } from "@core/repositories/jobs";
import JobDetailsResult from "@core/dto/jobs/jobDetailsResult.dto";
import { db } from "@infrastructure/db";
import { and, desc, eq, sql } from "drizzle-orm";
import JobAttemptsResponse from "@core/dto/jobs/jobAttemptsResponse.dto";
import JobResponse from "@core/dto/jobs/jobResponse.dto";
export default class JobRepository
  extends Repository<typeof jobs>
  implements IJobRepository
{
  constructor() {
    super(jobs);
  }

  async getJobDetails(jobId: string): Promise<JobDetailsResult | null> {
    const [row] = await db
      .select({
        job: jobs,
        pipeline: {
          sourcePath: pipelines.sourcePath,
          actionType: pipelines.actionType,
        },
      })
      .from(jobs)
      .leftJoin(pipelines, eq(jobs.pipelineId, pipelines.id))
      .where(eq(jobs.id, jobId))
      .limit(1);
    const subs = await db
      .select({
        url: subscribers.url,
      })
      .from(subscribers)
      .where(eq(subscribers.pipelineId, row.job.pipelineId!))
      .execute();

    if (!row) return null;
    console.log("row", row);
    const [metricsResult] = await db
      .select({
        total: sql<number>`count(${jobAttempts.id})`.mapWith(Number),

        success: sql<number>`
      count(*) filter (where ${jobAttempts.status} = 'SUCCESS')
    `.mapWith(Number),

        failed: sql<number>`
      count(*) filter (where ${jobAttempts.status} = 'FAILED')
    `.mapWith(Number),
      })
      .from(jobAttempts)
      .where(eq(jobAttempts.jobId, jobId))
      .execute();
    console.log("metricsResult", metricsResult);

    return {
      job: row.job,
      pipeline: row.pipeline,
      subscribers: subs,
      metrics: {
        totalSubscribers: metricsResult?.total ?? 0,
        successfulDeliveries: metricsResult?.success ?? 0,
        failedDeliveries: metricsResult?.failed ?? 0,
      },
    };
  }

  async getAttemptDetails(jobId: string): Promise<JobAttemptsResponse[]> {
    const rows = await db
      .select({
        jobId: jobs.id,
        attemptId: jobAttempts.id,
        subscriberUrl: subscribers.url,
        status: jobAttempts.status,
        responseCode: jobAttempts.responseCode,
        responseBody: jobAttempts.responseBody,
        nextRetryAt: jobAttempts.nextRetryAt,
        createdAt: jobAttempts.createdAt,
      })
      .from(jobs)
      .leftJoin(pipelines, eq(jobs.pipelineId, pipelines.id))
      .leftJoin(subscribers, eq(subscribers.pipelineId, pipelines.id))
      .leftJoin(
        jobAttempts,
        and(
          eq(jobAttempts.subscriberId, subscribers.id),
          eq(jobAttempts.jobId, jobs.id),
        ),
      )
      .where(eq(jobs.id, jobId))
      .execute();
    return rows;
  }

  async getJobs(
    page: number,
    limit: number,
  ): Promise<{ data: JobResponse[]; total: number }> {
    const offset = (page - 1) * limit;
    const data = await db
      .select({
        id: jobs.id,

        pipeline: pipelines.sourcePath,

        payload: jobs.payload,

        jobStatus: jobs.status,

        scheduledFor: jobs.scheduledFor,

        createdAt: jobs.createdAt,
      })
      .from(jobs)
      .leftJoin(pipelines, eq(jobs.pipelineId, pipelines.id))
      .orderBy(desc(jobs.createdAt)) // newest first
      .limit(limit)
      .offset(offset)
      .execute();

    // 2️⃣ get total count of jobs
    const [totalResult] = await db
      .select({
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(jobs)
      .execute();

    return {
      data,
      total: totalResult?.count ?? 0,
    };
  }
}
