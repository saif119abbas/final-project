const url = process.env.DB_URL || "";
//const apiKey=process.env.POLKA_KEY || ""
const migrationConfig = {
    migrationsFolder: "./src/infrastructure/db/migrations",
};
const config = {
    migrationConfig,
    url,
};
export default config;
