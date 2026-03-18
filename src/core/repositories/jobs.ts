import { Job } from "@core/models";
import IRepository from "./repository";
export type IJobRepository = IRepository<
  Job,
  Omit<Job, "updatedAt" | "createdAt">
>;
