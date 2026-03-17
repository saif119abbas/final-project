import IRepository from "./repository";
import Pipeline from "@core/models/pipeline.model";
export default interface IPipelineRepository extends IRepository<
  Pipeline,
  Omit<Pipeline, "updatedAt" | "createdAt">
>
{
  findBySourcePath(sourcePath: string): Promise<Pipeline | null>;
}
