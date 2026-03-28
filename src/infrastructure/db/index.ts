import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema/index";
import config from "@config/db.config";
/*const conn = postgres(config.url);

/*config.isCloudRun
  ? postgres({
      host: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
      database: process.env.DB_NAME ?? "zapier_clone",
      username: process.env.DB_USER ?? "postgres",
      password: process.env.DB_PASSWORD,
      ssl: false,
    })*/
let conn = undefined;

if (config.url) {
  conn = drizzle({
    connection: {
      url: config.url,
    },
    schema: schema,
  });
  console.log("Connected to database!");
} else {
  console.log("DATABASE_URL environment variable is not set");
  console.log("Running without CRUD endpoints");
}

export const db = conn;
export function assertDbConnection() {
  if (!db) {
    throw new Error("Database connection is not available");
  }
}

//export const db = drizzle(conn, { schema });
