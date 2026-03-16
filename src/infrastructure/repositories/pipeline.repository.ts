import { pipelines } from "@infrastructure/db/schema";
import Repository from "./repository";
import  IPipelineRepository  from "@core/repositories/pipeline";
import { db } from "@infrastructure/db";
import { eq } from "drizzle-orm";
import Pipeline from "@core/models/pipeline.model";

export default class PipelineRepository
  extends Repository<typeof pipelines>
  implements IPipelineRepository
  {
      constructor() {
        super(pipelines);
      }

      async findBySourcePath(sourcePath: string) {
        const [result] = await db
          .select()
          .from(pipelines)
          .where(eq(pipelines.sourcePath, sourcePath))
          .limit(1);
        return (result as unknown as Pipeline) ?? null;
      }
  }
