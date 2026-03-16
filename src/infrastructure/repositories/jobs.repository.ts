
import { jobs } from "@infrastructure/db/schema";
import Repository from "./repository";
import IJobRepository from "@core/repositories/jobs";
export default class JobRepository
  extends Repository<typeof jobs>
  implements IJobRepository
  {
     constructor() {
       super(jobs);
     }
   
  }

/*export default class JobRepository extends Repository<typeof jobs> implements IJobRepository {
  async create(entity: JobInsert): Promise<Job> {
    const [result] = await db
      .insert(jobs)
      .values({
        pipelineId: entity.pipelineId,
        payload: entity.payload,
        status: entity.status ?? JobStatus.PENDING,
        scheduledFor: entity.scheduledFor ?? new Date(),
      })
      .returning();
    return result as unknown as Job;
  }

  async findById(id: string): Promise<Job | null> {
    const [result] = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
    return (result as unknown as Job) ?? null;
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ data: Job[]; total: number }> {
    // Not needed for this project; keep interface compatibility.
    const offset = (page - 1) * limit;
    const data = await db.select().from(jobs).limit(limit).offset(offset);
    return { data: data as unknown as Job[], total: data.length };
  }

  async update(id: string, entity: Partial<JobInsert> & {
    status?: JobStatus;
    result?: JobResult | null;
    error?: string | null;
  }): Promise<Job> {
    const [result] = await db
      .update(jobs)
      .set({
        status: entity.status,
        result: (entity as { result?: unknown }).result,
        error: entity.error,
        scheduledFor: entity.scheduledFor,
      })
      .where(eq(jobs.id, id))
      .returning();
    return result as unknown as Job;
  }

  async delete(id: string): Promise<void> {
    await db.delete(jobs).where(eq(jobs.id, id));
  }
  }*/

