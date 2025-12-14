import { PrismaClient } from "./client/generated";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "@stackschool/shared";

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });
