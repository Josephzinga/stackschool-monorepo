import { defineConfig, env } from "prisma/config";
import { config } from "@stackschool/shared";

config();

export default defineConfig({
  schema: "./src/prisma/schema.prisma",
  migrations: {
    seed: "ts-node ./src/prisma/seed.ts",
    path: "./src/prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
