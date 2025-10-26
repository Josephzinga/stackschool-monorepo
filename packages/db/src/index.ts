import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export * from "@prisma/client"; // <-- exporte les types, enums, etc.
export { prisma };
