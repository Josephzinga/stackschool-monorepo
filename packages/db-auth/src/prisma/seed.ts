import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;

export const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.findMany();
  console.log('user', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
