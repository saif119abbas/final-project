import Repository from "./repository";
import { users } from "@infrastructure/db/schema";
import { db } from "@infrastructure/db";
import { eq } from "drizzle-orm";
export default class UserRepository extends Repository {
    constructor() {
        super(users);
    }
    async findByEmail(email) {
        // Fetch the user
        const [result] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);
        return result ?? null;
    }
}
