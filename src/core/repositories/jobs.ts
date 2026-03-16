import { Job } from "@core/models";
import IRepository from "./repository";
export default interface IJobRepository extends IRepository<Job,Omit<Job, "updatedAt" | "createdAt">>  {
}
