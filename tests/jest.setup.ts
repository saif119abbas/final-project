import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";

const resolvedDbUrl =process.env.TEST_DB_URL ?? "postgresql://postgres:postgres@localhost:5433/zapier_clone";
console.log("resolvedDbUrl",resolvedDbUrl)
process.env.DB_URL = resolvedDbUrl;
process.env.JWT_SECRET ??=
  "test_access_secret_0123456789abcdef0123456789abcdef";
process.env.JWT_REFRESH_SECRET ??=
  "test_refresh_secret_0123456789abcdef0123456789abcdef";
process.env.JWT_EXPIRES_IN ??= "15m";
process.env.JWT_REFRESH_EXPIRES_IN ??= "7d";
process.env.NODE_ENV ??= "test";

const connection = postgres(
 process.env.DB_URL, 
  {   
   max: 1,
  idle_timeout: 1,      // ← close idle connections quickly
  connect_timeout: 10, 
});
const db = drizzle(connection);

beforeAll(async () => {
  const { migrate } = await import("drizzle-orm/postgres-js/migrator");
  await migrate(db, { migrationsFolder: "./src/infrastructure/db/migrations" });
});

beforeEach(async () => {
  await db.execute(sql`
    TRUNCATE TABLE
      "job_attempts",
      "jobs",
      "subscribers",
      "pipelines",
      "refresh_tokens",
      "users"
    RESTART IDENTITY CASCADE
  `);
});

afterAll(async () => {
  await connection.end({ timeout: 5 });

});
