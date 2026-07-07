import { PrismaClient } from './prisma/generated/client/client.js';

// Initialisation ou re-export
export { PrismaClient };
export type * from './prisma/generated/client/index.js';
export type { Prisma } from './prisma/generated/client/index.ts';
