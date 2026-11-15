import "dotenv/config";
import { defineConfig } from "drizzle-kit";

console.log("DB URL:", process.env.DATABASE_URL); // Проверка

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
