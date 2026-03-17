
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

