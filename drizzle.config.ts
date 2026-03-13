import { defineConfig } from "drizzle-kit";
import config from "./src/config/db.config"
export default defineConfig({
  schema: "./src/infrastructure/db/schema/*.ts",
  out: "src/infrastructure/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: config.url,
  },
});