"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("@infrastructure/db");
const schema_1 = require("@infrastructure/db/schema");
const jobStatus_enum_1 = __importDefault(require("@core/enum/jobStatus.enum"));
class JobsRepository {
    async create(entity) {
        const [result] = await db_1.db
            .insert(schema_1.jobs)
            .values({
            pipelineId: entity.pipelineId,
            payload: entity.payload,
            status: entity.status ?? jobStatus_enum_1.default.PENDING,
            scheduledFor: entity.scheduledFor ?? new Date(),
        })
            .returning();
        return result;
    }
    async findById(id) {
        const [result] = await db_1.db.select().from(schema_1.jobs).where((0, drizzle_orm_1.eq)(schema_1.jobs.id, id)).limit(1);
        return result ?? null;
    }
    async findAll(page, limit) {
        // Not needed for this project; keep interface compatibility.
        const offset = (page - 1) * limit;
        const data = await db_1.db.select().from(schema_1.jobs).limit(limit).offset(offset);
        return { data: data, total: data.length };
    }
    async update(id, entity) {
        const [result] = await db_1.db
            .update(schema_1.jobs)
            .set({
            status: entity.status,
            result: entity.result,
            error: entity.error,
            scheduledFor: entity.scheduledFor,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.jobs.id, id))
            .returning();
        return result;
    }
    async delete(id) {
        await db_1.db.delete(schema_1.jobs).where((0, drizzle_orm_1.eq)(schema_1.jobs.id, id));
    }
}
exports.default = JobsRepository;
