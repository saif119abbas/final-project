import { User } from "@core/models/user.model";
import IRepository from "./repository";

export interface IUserRepository extends IRepository<
  User,
  Omit<User, "updatedAt" | "createdAt">
> {
  findByEmail(email: string): Promise<User | null>;
}
