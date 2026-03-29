import type { MigrationConfig } from "drizzle-orm/migrator";

const url = process.env.DATABASE_URL || process.env.DB_URL || "";
const isCloudRun = !!process.env.CLOUD_SQL_CONNECTION_NAME && !url;
const dbName = process.env.DB_NAME ?? "zapier_clone";
const dbPassword = process.env.DB_PASSWORD;
const connectionName = process.env.CLOUD_SQL_CONNECTION_NAME;
const dbUser = process.env.DB_USER ?? "postgres";
const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/infrastructure/db/migrations",
};
type DBConfig = {
  migrationConfig: MigrationConfig;
  url: string;
  isCloudRun: boolean;
  dbName: string;
  dbPassword?: string;
  connectionName?: string;
  dbUser: string;
};
const config: DBConfig = {
  migrationConfig,
  url,
  isCloudRun,
  dbName,
  dbPassword,
  connectionName,
  dbUser,
};
console.log("Database configuration:", config);
export default config;
