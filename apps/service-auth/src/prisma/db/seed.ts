import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client';

const connectionString = `${process.env.DATABASE_URL}`;

export const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });

async function main() {
  const adminId = '68240f02-c006-4fc5-acb1-d2f3a7691520';
  const user = await prisma.user.update({
    where: {
      id: adminId,
    },
    data: {
      profileCompleted: true,
      hasMembership: true,
    },
  });
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
