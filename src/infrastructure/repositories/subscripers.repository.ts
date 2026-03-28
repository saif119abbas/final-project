import { subscribers } from "@infrastructure/db/schema";
import Repository from "./repository";
import { ISubscribersRepository } from "@core/repositories/subscribers";
import { db } from "@infrastructure/db";
import { eq } from "drizzle-orm";
import { Subscriber } from "@core/models";

export default class SubscriberRepository
  extends Repository<typeof subscribers>
  implements ISubscribersRepository
{
  constructor() {
    super(subscribers);
  }

  async findByPipelineId(pipelineId: string): Promise<Subscriber[]> {
    if (!db) {
      throw new Error("Database connection is not available");
    }
    const results = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.pipelineId, pipelineId));
    return results as Subscriber[];
  }
}
