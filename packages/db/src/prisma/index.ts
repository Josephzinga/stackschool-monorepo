import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client/client.js';

const connectionString = `${process.env.DATABASE_URL}`;

export const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });
