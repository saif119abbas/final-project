import { IUserRepository } from "@core/repositories/user";
import Repository from "./repository";
import { users } from "@infrastructure/db/schema";
import { db } from "@infrastructure/db";
import { eq } from "drizzle-orm";
import { User } from "@core/models/user.model";

export default class UserRepository
  extends Repository<typeof users>
  implements IUserRepository
{
  constructor() {
    super(users);
  }

  async findByEmail(email: string): Promise<User | null> {
    if (!db) {
      throw new Error("Database connection is not available");
    }
    // Fetch the user
    const [result] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result ?? null;
  }
}
