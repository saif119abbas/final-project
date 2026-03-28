import { jobAttempts } from "@infrastructure/db/schema";
import Repository from "./repository";
import IJobAttemptReposiory from "@core/repositories/jobAttempt";
import { db } from "@infrastructure/db";
import { and, eq, lte } from "drizzle-orm";
import { JobAttempt } from "@core/models";
import AttemptStatus from "@core/enum/attemptStatus.enum";
export default class JobAttemptRepository
  extends Repository<typeof jobAttempts>
  implements IJobAttemptReposiory
{
  constructor() {
    super(jobAttempts);
  }
  async findDueForRetry(): Promise<JobAttempt[]> {
    if (!db) {
      throw new Error("Database connection is not available");
    }
    return db
      .select()
      .from(jobAttempts)
      .where(
        and(
          eq(jobAttempts.status, AttemptStatus.RETRY),
          lte(jobAttempts.nextRetryAt, new Date()),
          lte(jobAttempts.attemptNumber, 5),
        ),
      );
  }
  async findByJobId(jobId: string): Promise<JobAttempt[]> {
    if (!db) {
      throw new Error("Database connection is not available");
    }
    const result = await db
      .select()
      .from(jobAttempts)
      .where(eq(jobAttempts.jobId, jobId))
      .execute();
    return result;
  }
}
