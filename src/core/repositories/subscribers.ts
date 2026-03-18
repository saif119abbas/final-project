import { Subscriber } from "@core/models";
import IRepository from "./repository";

export interface ISubscribersRepository extends IRepository<
  Subscriber,
  Omit<Subscriber, "updatedAt" | "createdAt">
> {
  findByPipelineId(pipelineId: string): Promise<Subscriber[]>;
}
