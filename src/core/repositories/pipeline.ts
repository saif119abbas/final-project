import IRepository from "./repository";
import Pipeline from "@core/models/pipeline.model";
export type IPipelineRepository = IRepository<
  Pipeline,
  Omit<Pipeline, "updatedAt" | "createdAt">
>;
