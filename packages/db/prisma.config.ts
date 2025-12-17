import { defineConfig, env } from "prisma/config";
import { config } from "dotenv";

config();

export default defineConfig({
  schema: "./src/prisma/schema.prisma",
  migrations: {
    seed: "tsx ./src/prisma/seed.ts",
    path: "./src/prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
