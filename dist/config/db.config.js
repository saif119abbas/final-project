"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = process.env.DATABASE_URL || process.env.DB_URL || "";
//const apiKey=process.env.POLKA_KEY || ""
const migrationConfig = {
    migrationsFolder: "./src/infrastructure/db/migrations",
};
const config = {
    migrationConfig,
    url,
};
exports.default = config;
