import type { MigrationConfig } from "drizzle-orm/migrator";

const url=process.env.DB_URL || ""
//const apiKey=process.env.POLKA_KEY || ""
const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/infrastructure/db/migrations",
};
type DBConfig  = {
  migrationConfig: MigrationConfig;
  url:string
};
const config:DBConfig={
  migrationConfig,
  url,
}

export default config