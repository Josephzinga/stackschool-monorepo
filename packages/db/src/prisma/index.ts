import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./client/generated";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });
