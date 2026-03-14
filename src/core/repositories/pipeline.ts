import IRepository from "./repository";
import { Pipeline } from "@core/models";

export interface IPipelineRepository extends IRepository<Pipeline,Omit<Pipeline, "updatedAt" | "createdAt">> {}
