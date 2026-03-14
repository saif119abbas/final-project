import { db } from "@infrastructure/db/index";
import { eq } from "drizzle-orm";
export default class Repository {
    table;
    constructor(table) {
        this.table = table;
    }
    async create(entity) {
        const [result] = await db.insert(this.table).values(entity).returning();
        return result;
    }
    async findById(id) {
        const [result] = await db
            .select()
            .from(this.table)
            .where(eq(this.table.id, id))
            .limit(1);
        return result ?? null;
    }
    // ✅ Matches interface signature — fixes the findAll mismatch
    async findAll(page, limit) {
        const offset = (page - 1) * limit;
        const results = await db
            .select()
            .from(this.table)
            .limit(limit)
            .offset(offset);
        return results;
    }
    async update(id, entity) {
        const [result] = await db
            .update(this.table)
            .set(entity)
            .where(eq(this.table.id, id))
            .returning();
        return result;
    }
    async delete(id) {
        await db.delete(this.table).where(eq(this.table.id, id));
    }
}
