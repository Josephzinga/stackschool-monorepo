import { PrismaClient } from "@stackschool/db";
import { withAccelerate } from "@prisma/extension-accelerate";

export const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
}).$extends(withAccelerate());
