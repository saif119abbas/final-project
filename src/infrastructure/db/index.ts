import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index";
import config from "@config/db.config";
const conn = postgres(config.url);
export const db = drizzle(conn, { schema });
