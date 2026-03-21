"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../db/index");
const drizzle_orm_1 = require("drizzle-orm");
class Repository {
    constructor(table) {
        this.table = table;
    }
    async create(entity) {
        const [result] = await index_1.db.insert(this.table).values(entity).returning();
        return result;
    }
    async findById(id) {
        const [result] = await index_1.db
            .select()
            .from(this.table)
            .where((0, drizzle_orm_1.eq)(this.table.id, id))
            .limit(1);
        return result ?? null;
    }
    // ✅ Matches interface signature — fixes the findAll mismatch
    async findAll(page, limit) {
        const offset = (page - 1) * limit;
        const [{ count }] = await index_1.db
            .select({ count: (0, drizzle_orm_1.sql) `count(*)`.mapWith(Number) })
            .from(this.table);
        const data = await index_1.db
            .select()
            .from(this.table)
            .limit(limit)
            .offset(offset);
        return { data: data, total: count };
    }
    async update(id, entity) {
        const [result] = await index_1.db
            .update(this.table)
            .set(entity)
            .where((0, drizzle_orm_1.eq)(this.table.id, id))
            .returning();
        return result;
    }
    async delete(id) {
        await index_1.db.delete(this.table).where((0, drizzle_orm_1.eq)(this.table.id, id));
    }
}
exports.default = Repository;
