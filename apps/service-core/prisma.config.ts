import { defineConfig } from 'prisma/config';
import { config } from 'dotenv';

config();

export default defineConfig({
  schema: './src/prisma/db/schema.prisma',
  migrations: {
    seed: 'tsx ./src/prisma/db/seed.ts',
    path: './src/prisma/db/migrations',
  },

  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
