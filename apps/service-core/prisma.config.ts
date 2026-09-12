import { defineConfig } from 'prisma/config';
import { config } from 'dotenv';

config();

export default defineConfig({
  schema: './src/prisma/db/schemas.prisma',
  migrations: {
    seed: 'tsx ./src/prisma/db/permission.seed.ts',
    path: './src/prisma/db/migrations',
  },

  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
