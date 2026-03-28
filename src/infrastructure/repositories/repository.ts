import { db, assertDbConnection } from "@infrastructure/db/index";
import { eq, sql } from "drizzle-orm";
import { AnyPgTable, PgColumn, PgTable } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import IRepository from "@core/repositories/repository";
import { id } from "zod/v4/locales";

type WithId = { id: PgColumn };

export default class Repository<
  TTable extends AnyPgTable & WithId,
> implements IRepository<InferSelectModel<TTable>, InferInsertModel<TTable>> {
  private table: TTable;

  constructor(table: TTable) {
    this.table = table;
  }

  async create(
    entity: InferInsertModel<TTable>,
  ): Promise<InferSelectModel<TTable>> {
    if (!db) {
      throw new Error("Database connection is not available");
    }
    const [result] = await db.insert(this.table).values(entity).returning();
    return result as InferSelectModel<TTable>;
  }

  async findById(id: string): Promise<InferSelectModel<TTable> | null> {
    if (!db) {
      throw new Error("Database connection is not available");
    }
    const [result] = await db
      .select()
      .from(this.table as PgTable)
      .where(eq(this.table.id, id))
      .limit(1);
    return (result as InferSelectModel<TTable>) ?? null;
  }

  // ✅ Matches interface signature — fixes the findAll mismatch
  async findAll(
    page: number,
    limit: number,
  ): Promise<{ data: InferSelectModel<TTable>[]; total: number }> {
    if (!db) {
      throw new Error("Database connection is not available");
    }
    const offset = (page - 1) * limit;
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(this.table as PgTable);

    const data = await db
      .select()
      .from(this.table as PgTable)
      .limit(limit)
      .offset(offset);
    return { data: data as InferSelectModel<TTable>[], total: count };
  }

  async update(
    id: string,
    entity: Partial<InferInsertModel<TTable>>,
  ): Promise<InferSelectModel<TTable>> {
    if (!db) {
      throw new Error("Database connection is not available");
    }
    const [result] = await db
      .update(this.table)
      .set(entity)
      .where(eq(this.table.id, id))
      .returning();
    return result as InferSelectModel<TTable>;
  }

  async delete(id: string): Promise<void> {
    if (!db) {
      throw new Error("Database connection is not available");
    }
    await db.delete(this.table).where(eq(this.table.id, id));
  }
}
