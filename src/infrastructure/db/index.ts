import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index";
import config from "@config/db.config";
const conn =  postgres(config.url);


/*config.isCloudRun
  ? postgres({
      host: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
      database: process.env.DB_NAME ?? "zapier_clone",
      username: process.env.DB_USER ?? "postgres",
      password: process.env.DB_PASSWORD,
      ssl: false,
    })*/
  

export const db = drizzle(conn, { schema });
